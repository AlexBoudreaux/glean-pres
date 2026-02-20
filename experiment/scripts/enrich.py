"""
Enrichment pipeline: Loop through all 220 companies, call Claude CLI
for each, save structured JSON results.

Features:
- Parallel execution (configurable workers, default 5)
- Resume support: skips companies that already have valid enrichment files
- Retry with exponential backoff on failures
- JSON extraction from messy output
- Logging to file and stdout
- Graceful Ctrl+C handling
- Progress tracking with ETA
"""
import json
import os
import subprocess
import sys
import tempfile
import time
import re
import signal
import logging
import threading
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path
from datetime import datetime, timedelta

# Paths
BASE_DIR = Path(__file__).parent.parent
DATA_DIR = BASE_DIR / "data"
ENRICHED_DIR = DATA_DIR / "enriched"
PROMPT_TEMPLATE = BASE_DIR / "prompts" / "enrichment_prompt.txt"
LOG_FILE = BASE_DIR / "enrichment.log"
PROGRESS_FILE = BASE_DIR / "enrichment_progress.json"

# Config
MODEL = "claude-sonnet-4-6"
MAX_TURNS = 25
MAX_RETRIES = 3
RETRY_BASE_DELAY = 30  # seconds
TIMEOUT_SECONDS = 300  # 5 min per company
MAX_WORKERS = 5  # parallel enrichment calls
STAGGER_DELAY = 3  # seconds between launching workers to avoid burst

# Thread-safe state
lock = threading.Lock()
completed_count = 0
failed_list = []
consecutive_failures = 0
shutdown_requested = False
MAX_CONSECUTIVE_FAILURES = 10  # auto-stop if 10 in a row fail (likely API limit)
clean_env = {k: v for k, v in os.environ.items() if k != "CLAUDECODE"}


def signal_handler(sig, frame):
    global shutdown_requested
    if shutdown_requested:
        logging.warning("Force quit requested. Exiting immediately.")
        os._exit(1)
    shutdown_requested = True
    logging.info("Shutdown requested. Waiting for active workers to finish...")
    print("\n[CTRL+C] Waiting for active workers to finish. Press again to force quit.")

signal.signal(signal.SIGINT, signal_handler)


def setup_logging():
    logger = logging.getLogger()
    logger.setLevel(logging.INFO)
    formatter = logging.Formatter("%(asctime)s [%(levelname)s] %(message)s")

    fh = logging.FileHandler(LOG_FILE)
    fh.setFormatter(formatter)
    logger.addHandler(fh)

    sh = logging.StreamHandler(sys.stdout)
    sh.setFormatter(formatter)
    logger.addHandler(sh)


def load_companies():
    """Load both known customers and non-customers into one list."""
    companies = []

    known_file = DATA_DIR / "raw" / "known_customers.json"
    with open(known_file) as f:
        known = json.load(f)
        for c in known:
            c["is_known_customer"] = True
        companies.extend(known)
    logging.info(f"Loaded {len(known)} known customers")

    non_cust_file = DATA_DIR / "raw" / "non_customers_176.json"
    with open(non_cust_file) as f:
        non_customers = json.load(f)
        for c in non_customers:
            c["is_known_customer"] = False
        companies.extend(non_customers)
    logging.info(f"Loaded {len(non_customers)} non-customers")

    logging.info(f"Total companies to enrich: {len(companies)}")
    return companies


def get_output_path(company):
    """Generate output file path for a company."""
    safe_name = re.sub(r'[^a-zA-Z0-9]', '_', company["domain"].lower().rstrip('.'))
    return ENRICHED_DIR / f"{safe_name}.json"


def is_already_enriched(output_path):
    """Check if a company already has a valid enrichment file."""
    if not output_path.exists():
        return False
    try:
        with open(output_path) as f:
            data = json.load(f)
        if "signals" in data and len(data["signals"]) >= 9:
            return True
        return False
    except (json.JSONDecodeError, KeyError):
        return False


def extract_json(text):
    """Extract JSON object from potentially messy output."""
    text = text.strip()

    # Try parsing as-is first
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        pass

    # Try extracting from markdown code fences
    match = re.search(r'```(?:json)?\s*(\{.*?\})\s*```', text, re.DOTALL)
    if match:
        try:
            return json.loads(match.group(1))
        except json.JSONDecodeError:
            pass

    # Try finding the first { ... } block
    brace_start = text.find('{')
    if brace_start != -1:
        depth = 0
        for i in range(brace_start, len(text)):
            if text[i] == '{':
                depth += 1
            elif text[i] == '}':
                depth -= 1
                if depth == 0:
                    try:
                        return json.loads(text[brace_start:i+1])
                    except json.JSONDecodeError:
                        break

    return None


def validate_enrichment(data):
    """Check that enrichment data has the expected structure."""
    if not isinstance(data, dict):
        return False, "Not a dict"
    if "signals" not in data:
        return False, "Missing 'signals' key"
    expected_signals = [
        "tool_count", "tool_overlap", "employee_count", "headcount_growth",
        "distributed_workforce", "km_hiring", "workplace_leadership",
        "financial_capacity", "enterprise_saas"
    ]
    missing = [s for s in expected_signals if s not in data["signals"]]
    if missing:
        return False, f"Missing signals: {missing}"
    for signal_name, signal_data in data["signals"].items():
        if "score" not in signal_data:
            return False, f"Signal '{signal_name}' missing 'score'"
        if not isinstance(signal_data["score"], (int, float)):
            return False, f"Signal '{signal_name}' score is not numeric"
        if signal_data["score"] < 0 or signal_data["score"] > 3:
            return False, f"Signal '{signal_name}' score {signal_data['score']} out of range 0-3"
    return True, "OK"


def build_prompt(company, template):
    """Build the enrichment prompt for a specific company."""
    company_data = {
        "company_name": company.get("company_name", ""),
        "domain": company.get("domain", ""),
        "description": company.get("description", ""),
        "industry": company.get("industry", ""),
        "employee_count": company.get("employee_count"),
        "type": company.get("type", ""),
        "location": company.get("location", ""),
        "country": company.get("country", ""),
        "linkedin_url": company.get("linkedin_url", ""),
        "total_funding": company.get("total_funding"),
        "total_funding_raw": company.get("total_funding_raw", ""),
        "founded": company.get("founded", ""),
    }
    return template.replace("{company_data}", json.dumps(company_data, indent=2))


def call_claude(prompt, worker_id):
    """Call Claude CLI and return the raw output."""
    # Each worker gets its own temp file to avoid conflicts
    tmp_prompt = BASE_DIR / "prompts" / f"_prompt_worker_{worker_id}.txt"
    with open(tmp_prompt, "w") as f:
        f.write(prompt)

    cmd = [
        "claude", "-p",
        "--model", MODEL,
        "--max-turns", str(MAX_TURNS),
        "--tools", "WebSearch,WebFetch",
        "--allowedTools", "WebSearch,WebFetch",
        "--output-format", "text",
    ]

    with open(tmp_prompt) as stdin_file:
        result = subprocess.run(
            cmd,
            stdin=stdin_file,
            capture_output=True,
            text=True,
            timeout=TIMEOUT_SECONDS,
            env=clean_env,
        )

    if result.returncode != 0:
        stderr = result.stderr.strip()
        # Filter out the osgrep hook error (harmless)
        if "osgrep" in stderr and result.stdout.strip():
            return result.stdout.strip()
        raise RuntimeError(f"Claude CLI exited with code {result.returncode}: {stderr[:500]}")

    return result.stdout.strip()


def enrich_company(company, template, worker_id):
    """Enrich a single company with retries."""
    prompt = build_prompt(company, template)

    for attempt in range(1, MAX_RETRIES + 1):
        if shutdown_requested:
            return None

        try:
            raw_output = call_claude(prompt, worker_id)

            if not raw_output:
                raise RuntimeError("Empty output from Claude CLI")

            data = extract_json(raw_output)
            if data is None:
                raise RuntimeError(f"Could not extract JSON from output: {raw_output[:200]}...")

            valid, reason = validate_enrichment(data)
            if not valid:
                raise RuntimeError(f"Invalid enrichment structure: {reason}")

            # Add metadata
            data["is_known_customer"] = company.get("is_known_customer", False)
            data["enriched_at"] = datetime.now().isoformat()
            data["model"] = MODEL

            return data

        except subprocess.TimeoutExpired:
            logging.warning(f"  [{company['company_name']}] Timeout on attempt {attempt}/{MAX_RETRIES}")
        except RuntimeError as e:
            logging.warning(f"  [{company['company_name']}] Error on attempt {attempt}/{MAX_RETRIES}: {e}")
        except Exception as e:
            logging.warning(f"  [{company['company_name']}] Unexpected error on attempt {attempt}/{MAX_RETRIES}: {type(e).__name__}: {e}")

        if attempt < MAX_RETRIES:
            delay = RETRY_BASE_DELAY * (2 ** (attempt - 1))
            logging.info(f"  [{company['company_name']}] Retrying in {delay}s...")
            time.sleep(delay)

    return None


def process_company(company, template, worker_id, total):
    """Process a single company (called by thread pool)."""
    global completed_count, failed_list, consecutive_failures, shutdown_requested

    if shutdown_requested:
        return

    name = company["company_name"]
    domain = company["domain"]
    output_path = get_output_path(company)
    is_customer = "CUSTOMER" if company.get("is_known_customer") else "non-customer"

    with lock:
        current = completed_count + 1
    logging.info(f"[{current}/{total}] Enriching {name} ({domain}) [{is_customer}]")

    data = enrich_company(company, template, worker_id)

    if data:
        with open(output_path, "w") as f:
            json.dump(data, f, indent=2)
        with lock:
            completed_count += 1
            consecutive_failures = 0
        logging.info(f"  [{name}] Saved to {output_path.name}")
    else:
        with lock:
            failed_list.append({"company_name": name, "domain": domain})
            consecutive_failures += 1
            if consecutive_failures >= MAX_CONSECUTIVE_FAILURES:
                shutdown_requested = True
                logging.error(f"  [{name}] FAILED. {MAX_CONSECUTIVE_FAILURES} consecutive failures hit. Likely API limit. Auto-stopping.")
                return
        logging.error(f"  [{name}] FAILED after {MAX_RETRIES} attempts (consecutive: {consecutive_failures})")


def save_progress(total, start_time):
    """Save progress to a JSON file for monitoring."""
    with lock:
        done = completed_count
        fails = list(failed_list)

    elapsed = time.time() - start_time
    avg_per_company = elapsed / max(done, 1)
    # With parallel workers, effective rate is faster
    effective_rate = elapsed / max(done, 1) / MAX_WORKERS if done > MAX_WORKERS else avg_per_company
    remaining = total - done - len(fails)
    eta_seconds = remaining * effective_rate

    progress = {
        "completed": done,
        "failed": len(fails),
        "failed_companies": fails,
        "total": total,
        "remaining": remaining,
        "workers": MAX_WORKERS,
        "elapsed_seconds": round(elapsed),
        "elapsed_human": str(timedelta(seconds=round(elapsed))),
        "avg_seconds_per_company": round(avg_per_company, 1),
        "eta_seconds": round(max(eta_seconds, 0)),
        "eta_human": str(timedelta(seconds=round(max(eta_seconds, 0)))),
        "updated_at": datetime.now().isoformat(),
    }
    with open(PROGRESS_FILE, "w") as f:
        json.dump(progress, f, indent=2)


def main():
    global completed_count

    setup_logging()
    logging.info("=" * 60)
    logging.info(f"ENRICHMENT PIPELINE STARTING ({MAX_WORKERS} parallel workers)")
    logging.info("=" * 60)

    ENRICHED_DIR.mkdir(parents=True, exist_ok=True)

    # Load template
    with open(PROMPT_TEMPLATE) as f:
        template = f.read()
    logging.info(f"Loaded prompt template ({len(template)} chars)")

    # Load companies
    companies = load_companies()

    # Check what's already done
    skipped = 0
    to_process = []
    for c in companies:
        output_path = get_output_path(c)
        if is_already_enriched(output_path):
            skipped += 1
        else:
            to_process.append(c)

    completed_count = skipped
    logging.info(f"Already enriched: {skipped}")
    logging.info(f"Remaining to process: {len(to_process)}")

    if not to_process:
        logging.info("All companies already enriched. Nothing to do.")
        return

    total = len(companies)
    start_time = time.time()

    # Progress saver thread
    def progress_loop():
        while not shutdown_requested:
            save_progress(total, start_time)
            time.sleep(10)
        save_progress(total, start_time)

    progress_thread = threading.Thread(target=progress_loop, daemon=True)
    progress_thread.start()

    # Process with thread pool
    with ThreadPoolExecutor(max_workers=MAX_WORKERS) as executor:
        futures = {}
        for i, company in enumerate(to_process):
            if shutdown_requested:
                break
            # Stagger launches to avoid burst
            if i > 0 and i % MAX_WORKERS == 0:
                time.sleep(STAGGER_DELAY)
            worker_id = i % MAX_WORKERS
            future = executor.submit(process_company, company, template, worker_id, total)
            futures[future] = company

        # Wait for all to complete
        for future in as_completed(futures):
            if shutdown_requested:
                break
            try:
                future.result()
            except Exception as e:
                company = futures[future]
                logging.error(f"  [{company['company_name']}] Worker exception: {e}")

    # Final progress save
    save_progress(total, start_time)

    # Summary
    elapsed = time.time() - start_time
    logging.info("=" * 60)
    logging.info("ENRICHMENT COMPLETE")
    logging.info(f"  Workers: {MAX_WORKERS}")
    logging.info(f"  Total time: {timedelta(seconds=round(elapsed))}")
    logging.info(f"  Completed: {completed_count}/{total}")
    logging.info(f"  Failed: {len(failed_list)}")
    if failed_list:
        logging.info("  Failed companies:")
        for f_company in failed_list:
            logging.info(f"    - {f_company['company_name']} ({f_company['domain']})")
    logging.info("=" * 60)


if __name__ == "__main__":
    main()
