#!/usr/bin/env python3
"""
Cross-reference competitor customer lists against our 220-company dataset.
Produces a standalone JSON file with match results per company.
Does NOT edit any existing enrichment files.
"""

import json
import re
from pathlib import Path

# Competitor customer lists scraped via WebFetch on 2026-02-18
COMPETITOR_CUSTOMERS = {
    "Guru": [
        "Perk", "Lemonade", "Empathy", "Favor", "Motion", "HireVue",
        "FoodCorps", "Paraco Gas", "Symphony Workplaces", "Bonafide Health",
        "Movable Ink", "Xenium HR", "TIM", "NexHealth", "SeatGeek",
        "Branch", "Shopify", "Trusted Health"
    ],
    "Coveo": [
        "SAP"
    ],
    "Elastic": [
        "TVH", "Ameritas", "Ray Security", "FRAIM", "BBVA",
        "Mitsui Fudosan", "Sightly", "Akeneo", "Sprouts.AI", "Vectorize",
        "Box", "InfoTrack", "Sprint", "USAA", "JPL"
    ],
    "Notion": [
        "Qonto", "Faire", "Cursor", "Ramp", "Vercel", "OpenAI", "Cohere",
        "Figma", "Toyota", "Affirm", "Mercury", "Descript", "Parloa",
        "Qwilr", "Planful", "Linktree", "Raw Studio", "Dojo",
        "Wealthsimple", "Pinecone", "Viva", "Mangopay"
    ],
    "Slite": [
        "Maison Baum", "GraphXSource", "TSN Lab", "Filmustage", "Omnisend",
        "Sytex", "Eulerian", "Upvest", "Idea Informatica", "Guindi",
        "Forest Admin", "Go Auto", "Airmeet", "Atomic Cartoons",
        "Karhu Helsinki", "Gatheround", "OneUp Sales", "Huli", "VanMoof",
        "Agorapulse", "Premium Plus", "Wundertax", "PVCase", "Meero"
    ],
    "Moveworks": [
        "CVS Health", "Broadcom", "West Monroe", "Palo Alto Networks",
        "Procore", "Amadeus", "Coca-Cola Consolidated", "Ciena", "Leidos",
        "ManTech", "Databricks", "Jamf", "Equinix", "Unity", "Mercari",
        "AkzoNobel", "Nutanix", "Verisk", "Hearst", "Vituity", "Wellstar",
        "TC Energy", "The Wonderful Company", "Stitch Fix", "Robert Half",
        "Medallia", "loanDepot", "Intercontinental Exchange", "Consumers Energy",
        "Albemarle", "World Wide Technology"
    ],
}


def normalize(name: str) -> str:
    """Lowercase, strip punctuation/suffixes, collapse whitespace."""
    s = name.lower().strip()
    # remove common suffixes
    for suffix in [", inc.", ", inc", " inc.", " inc", " llc", " ltd", " corp",
                   " corporation", ".com", ".io", ".ai", ".co"]:
        if s.endswith(suffix):
            s = s[: -len(suffix)]
    # remove punctuation
    s = re.sub(r"[^a-z0-9\s]", "", s)
    # collapse whitespace
    s = re.sub(r"\s+", " ", s).strip()
    return s


def fuzzy_match(company_name: str, competitor_name: str) -> bool:
    """Check if two names refer to the same company. Conservative to avoid false positives."""
    a = normalize(company_name)
    b = normalize(competitor_name)

    # exact match after normalization
    if a == b:
        return True

    # space-collapsed match (handles "World Wide Technology" vs "Worldwide Technology")
    a_nospace = a.replace(" ", "")
    b_nospace = b.replace(" ", "")
    if a_nospace == b_nospace:
        return True

    # first-word match only if the first word is long enough (>=6 chars)
    # handles "Databricks" matching "Databricks, Inc." etc.
    a_first = a.split()[0] if a.split() else ""
    b_first = b.split()[0] if b.split() else ""
    if len(a_first) >= 6 and len(b_first) >= 6 and a_first == b_first:
        return True

    # substring match only if the shorter string is >=75% the length of the longer
    # this prevents "Viva" matching "Conviva" or "Cohere" matching "Coherent Solutions"
    if len(a) >= 5 and len(b) >= 5:
        shorter, longer = (a, b) if len(a) <= len(b) else (b, a)
        if shorter in longer and len(shorter) / len(longer) >= 0.75:
            return True

    return False


def main():
    base = Path(__file__).resolve().parent.parent / "data" / "raw"
    all_companies = json.loads((base / "all_companies.json").read_text())
    known_customers = json.loads((base / "known_customers.json").read_text())

    # combine into one list
    all_cos = []
    seen_domains = set()
    for c in known_customers + all_companies:
        domain = c.get("domain", "")
        if domain not in seen_domains:
            seen_domains.add(domain)
            all_cos.append(c)

    print(f"Total unique companies: {len(all_cos)}")

    # build flat list of (competitor_name, source) pairs
    competitor_entries = []
    for source, names in COMPETITOR_CUSTOMERS.items():
        for name in names:
            competitor_entries.append((name, source))

    total_competitor_names = sum(len(v) for v in COMPETITOR_CUSTOMERS.values())
    print(f"Total competitor customer names: {total_competitor_names}")

    # match each company
    results = []
    match_count = 0

    for co in all_cos:
        company_name = co["company_name"]
        is_customer = co.get("is_known_customer", False)

        matches = []
        for comp_name, source in competitor_entries:
            if fuzzy_match(company_name, comp_name):
                matches.append({"competitor": source, "matched_name": comp_name})

        # deduplicate by competitor (a company might match multiple names on same page)
        seen_competitors = set()
        unique_matches = []
        for m in matches:
            if m["competitor"] not in seen_competitors:
                seen_competitors.add(m["competitor"])
                unique_matches.append(m)

        num_competitors = len(unique_matches)

        # scoring rubric from handoff doc
        if num_competitors == 0:
            score = 0
        elif num_competitors == 1:
            score = 1
        elif num_competitors <= 3:
            score = 2
        else:
            score = 3

        if num_competitors > 0:
            competitors_list = [m["competitor"] for m in unique_matches]
            reasoning = f"Found on {', '.join(competitors_list)} customer page(s) ({num_competitors} competitor{'s' if num_competitors > 1 else ''})"
        else:
            reasoning = "Not found on any competitor customer page"

        entry = {
            "company_name": company_name,
            "domain": co.get("domain", ""),
            "is_known_customer": is_customer,
            "competitor_km_customer": {
                "score": score,
                "reasoning": reasoning,
                "matches": unique_matches,
                "num_competitors_matched": num_competitors,
            },
        }
        results.append(entry)

        if num_competitors > 0:
            match_count += 1

    # sort: matches first (by score desc), then alphabetical
    results.sort(key=lambda x: (-x["competitor_km_customer"]["score"], x["company_name"]))

    # summary stats
    customer_matches = [r for r in results if r["is_known_customer"] and r["competitor_km_customer"]["score"] > 0]
    non_customer_matches = [r for r in results if not r["is_known_customer"] and r["competitor_km_customer"]["score"] > 0]

    summary = {
        "signal_name": "competitor_km_customer",
        "sources_scraped": list(COMPETITOR_CUSTOMERS.keys()),
        "total_competitor_names": total_competitor_names,
        "total_companies_checked": len(all_cos),
        "total_matches": match_count,
        "customer_matches": len(customer_matches),
        "non_customer_matches": len(non_customer_matches),
        "known_customers_total": sum(1 for r in results if r["is_known_customer"]),
        "non_customers_total": sum(1 for r in results if not r["is_known_customer"]),
        "customer_match_rate": f"{len(customer_matches) / max(1, sum(1 for r in results if r['is_known_customer'])) * 100:.1f}%",
        "non_customer_match_rate": f"{len(non_customer_matches) / max(1, sum(1 for r in results if not r['is_known_customer'])) * 100:.1f}%",
    }

    output = {"summary": summary, "results": results}

    out_path = Path(__file__).resolve().parent.parent / "data" / "competitor_km_customer_scores.json"
    out_path.write_text(json.dumps(output, indent=2))
    print(f"\nOutput written to: {out_path}")

    # print summary
    print(f"\n{'='*60}")
    print(f"RESULTS SUMMARY")
    print(f"{'='*60}")
    print(f"Companies checked:        {summary['total_companies_checked']}")
    print(f"Total matches:            {summary['total_matches']}")
    print(f"Known customer matches:   {summary['customer_matches']} / {summary['known_customers_total']} ({summary['customer_match_rate']})")
    print(f"Non-customer matches:     {summary['non_customer_matches']} / {summary['non_customers_total']} ({summary['non_customer_match_rate']})")
    print()

    print("MATCHED COMPANIES:")
    print("-" * 60)
    for r in results:
        if r["competitor_km_customer"]["score"] > 0:
            tag = "CUSTOMER" if r["is_known_customer"] else "non-cust"
            score = r["competitor_km_customer"]["score"]
            reasoning = r["competitor_km_customer"]["reasoning"]
            print(f"  [{tag}] {r['company_name']} (score={score}) - {reasoning}")


if __name__ == "__main__":
    main()
