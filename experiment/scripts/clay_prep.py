"""
Merge Clay CSV exports, deduplicate, remove known customers,
and produce a clean combined dataset.
"""
import csv
import json
import os
from pathlib import Path

RAW_DIR = Path(__file__).parent.parent / "data" / "raw"
OUTPUT_FILE = Path(__file__).parent.parent / "data" / "raw" / "all_companies.json"

# 44 known Glean customers (lowercase domains and names for matching)
KNOWN_CUSTOMERS = [
    "booking.com", "databricks", "wealthsimple", "confluent", "webflow",
    "super.com", "upside", "grammarly", "cro metrics", "duolingo",
    "deutsche telekom", "nextdoor", "motive", "sigma computing", "time",
    "gcash", "pure storage", "dbs", "plaid", "pinterest",
    "launchdarkly", "greenhouse", "bill", "gainsight", "vanta",
    "zscaler", "samsung", "redis", "betterup", "samsara",
    "seatgeek", "instacart", "abnormal", "handshake",
    "worldwide technology", "crunchyroll", "reddit", "rivian",
    "zillow", "zapier", "rubrik", "intercom", "intuit",
    "covered california"
]

KNOWN_DOMAINS = [
    "booking.com", "databricks.com", "wealthsimple.com", "confluent.io",
    "webflow.com", "super.com", "upside.com", "grammarly.com",
    "crometrics.com", "duolingo.com", "telekom.com", "nextdoor.com",
    "gomotive.com", "sigmacomputing.com", "time.com", "gcash.com",
    "purestorage.com", "dbs.com", "plaid.com", "pinterest.com",
    "launchdarkly.com", "greenhouse.io", "bill.com", "gainsight.com",
    "vanta.com", "zscaler.com", "samsung.com", "redis.com",
    "betterup.com", "samsara.com", "seatgeek.com", "instacart.com",
    "abnormalsecurity.com", "joinhandshake.com", "wwt.com",
    "crunchyroll.com", "reddit.com", "rivian.com", "zillow.com",
    "zapier.com", "rubrik.com", "intercom.com", "intuit.com",
    "coveredca.com"
]


def is_known_customer(name, domain):
    name_lower = name.lower().strip()
    domain_lower = domain.lower().strip() if domain else ""

    # Exact domain match (most reliable)
    for kd in KNOWN_DOMAINS:
        if kd == domain_lower:
            return True

    # Exact name match or name starts with known customer
    for kc in KNOWN_CUSTOMERS:
        if name_lower == kc or name_lower.startswith(kc + " ") or kc == name_lower:
            return True
        # Also check if known customer name matches start of company name
        # but only for names longer than 4 chars to avoid false positives
        if len(kc) > 4 and name_lower == kc:
            return True

    return False


def parse_employee_count(size_str, exact_count):
    """Try exact count first, fall back to size bucket midpoint."""
    if exact_count and str(exact_count).strip():
        try:
            return int(str(exact_count).strip().replace(",", ""))
        except ValueError:
            pass

    if not size_str:
        return None

    size_str = size_str.strip()
    midpoints = {
        "1-10 employees": 5,
        "11-50 employees": 30,
        "51-200 employees": 125,
        "201-500 employees": 350,
        "501-1,000 employees": 750,
        "1,001-5,000 employees": 3000,
        "5,001-10,000 employees": 7500,
        "10,001+ employees": 15000,
    }
    return midpoints.get(size_str)


def parse_funding(funding_str):
    if not funding_str or not funding_str.strip():
        return None
    f = funding_str.strip().replace("$", "").replace(",", "")
    multiplier = 1
    if f.endswith("B"):
        multiplier = 1_000_000_000
        f = f[:-1]
    elif f.endswith("M"):
        multiplier = 1_000_000
        f = f[:-1]
    elif f.endswith("K"):
        multiplier = 1_000
        f = f[:-1]
    try:
        return float(f) * multiplier
    except ValueError:
        return None


def main():
    all_companies = []
    seen_domains = set()
    known_found = []

    csv_files = sorted(RAW_DIR.glob("batch*.csv"))
    print(f"Found {len(csv_files)} batch files")

    for csv_file in csv_files:
        with open(csv_file, "r", encoding="utf-8") as f:
            reader = csv.DictReader(f)
            count = 0
            for row in reader:
                name = row.get("Name", "").strip()
                domain = row.get("Domain", "").strip()

                if not name or not domain:
                    continue

                # Deduplicate by domain
                if domain.lower() in seen_domains:
                    continue
                seen_domains.add(domain.lower())

                # Check if known customer
                if is_known_customer(name, domain):
                    known_found.append(name)
                    continue

                employee_count = parse_employee_count(
                    row.get("Size", ""),
                    row.get("Employee Count", "")
                )

                company = {
                    "company_name": name,
                    "domain": domain,
                    "description": row.get("Description", "").strip(),
                    "industry": row.get("Primary Industry", "").strip(),
                    "size_bucket": row.get("Size", "").strip(),
                    "employee_count": employee_count,
                    "type": row.get("Type", "").strip(),
                    "location": row.get("Location", "").strip(),
                    "country": row.get("Country", "").strip(),
                    "linkedin_url": row.get("LinkedIn URL", "").strip(),
                    "total_funding": parse_funding(row.get("Total Funds Raised", "")),
                    "total_funding_raw": row.get("Total Funds Raised", "").strip(),
                    "founded": row.get("Founded", "").strip(),
                    "is_known_customer": False,
                }
                all_companies.append(company)
                count += 1

            print(f"  {csv_file.name}: {count} companies added")

    print(f"\nKnown customers found and removed: {len(known_found)}")
    for kc in known_found:
        print(f"  - {kc}")

    print(f"\nTotal non-customer companies: {len(all_companies)}")

    # Size distribution
    size_dist = {}
    for c in all_companies:
        bucket = c["size_bucket"] or "Unknown"
        size_dist[bucket] = size_dist.get(bucket, 0) + 1
    print("\nSize distribution:")
    for bucket, count in sorted(size_dist.items()):
        print(f"  {bucket}: {count}")

    # Check how many have funding data
    with_funding = sum(1 for c in all_companies if c["total_funding"])
    with_exact_count = sum(1 for c in all_companies if c["employee_count"] and c["size_bucket"] not in str(c["employee_count"]))
    print(f"\nWith funding data: {with_funding}/{len(all_companies)}")
    print(f"With exact employee count: {with_exact_count}/{len(all_companies)}")

    # Save
    with open(OUTPUT_FILE, "w") as f:
        json.dump(all_companies, f, indent=2)
    print(f"\nSaved to {OUTPUT_FILE}")


if __name__ == "__main__":
    main()
