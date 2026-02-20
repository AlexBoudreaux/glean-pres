"""
Quick analysis of enrichment data we have so far.
Check signal distributions, customer vs non-customer separation,
and whether the experiment looks viable.
"""
import json
from pathlib import Path
from collections import defaultdict

ENRICHED_DIR = Path(__file__).parent.parent / "data" / "enriched"

WEIGHTS = {
    "tool_overlap": 3,
    "km_hiring": 3,
    "competitor_km_customer": 3,
    "tool_count": 2,
    "headcount_growth": 2,
    "workplace_leadership": 2,
    "employee_count": 1,
    "distributed_workforce": 1,
    "financial_capacity": 1,
    "enterprise_saas": 1,
}
MAX_SCORE = 3 * sum(WEIGHTS.values())  # 57

def load_all():
    customers = []
    non_customers = []
    for f in sorted(ENRICHED_DIR.glob("*.json")):
        with open(f) as fh:
            data = json.load(fh)
        if data.get("is_known_customer"):
            customers.append(data)
        else:
            non_customers.append(data)
    return customers, non_customers

def compute_score(company):
    raw = 0
    for signal, weight in WEIGHTS.items():
        raw += company["signals"][signal]["score"] * weight
    return round((raw / MAX_SCORE) * 100)

def avg(lst):
    return round(sum(lst) / len(lst), 1) if lst else 0

def main():
    customers, non_customers = load_all()
    print(f"=== EARLY ANALYSIS ({len(customers) + len(non_customers)} companies enriched) ===")
    print(f"Known customers: {len(customers)}")
    print(f"Non-customers:   {len(non_customers)}")
    print()

    # Score everyone
    cust_scores = [(c["company_name"], compute_score(c)) for c in customers]
    non_cust_scores = [(c["company_name"], compute_score(c)) for c in non_customers]

    all_scores = [(name, score, True) for name, score in cust_scores] + \
                 [(name, score, False) for name, score in non_cust_scores]
    all_scores.sort(key=lambda x: x[1], reverse=True)

    print(f"--- OVERALL SCORES ---")
    print(f"Avg customer score:     {avg([s for _, s in cust_scores])}")
    print(f"Avg non-customer score: {avg([s for _, s in non_cust_scores])}")
    print(f"Separation:             {avg([s for _, s in cust_scores]) - avg([s for _, s in non_cust_scores]):.1f} points")
    print()

    # Top quartile hit rate
    total = len(all_scores)
    top_25_cutoff = max(1, total // 4)
    top_25 = all_scores[:top_25_cutoff]
    customers_in_top_25 = sum(1 for _, _, is_cust in top_25 if is_cust)
    expected_random = round(len(customers) / total * top_25_cutoff, 1)
    print(f"--- TOP QUARTILE ({top_25_cutoff} companies) ---")
    print(f"Customers in top 25%: {customers_in_top_25}/{top_25_cutoff}")
    print(f"Expected by random:   {expected_random}")
    print(f"Hit rate:             {customers_in_top_25/top_25_cutoff*100:.0f}%")
    print(f"Random baseline:      {len(customers)/total*100:.0f}%")
    print()

    # Top 10
    top_10 = all_scores[:10]
    customers_in_top_10 = sum(1 for _, _, is_cust in top_10 if is_cust)
    print(f"--- TOP 10 ---")
    for i, (name, score, is_cust) in enumerate(top_10, 1):
        label = "CUSTOMER" if is_cust else ""
        print(f"  {i:2}. {name:40s} {score:3d}  {label}")
    print()

    # Bottom 10
    bottom_10 = all_scores[-10:]
    print(f"--- BOTTOM 10 ---")
    for i, (name, score, is_cust) in enumerate(bottom_10, 1):
        label = "CUSTOMER" if is_cust else ""
        print(f"  {i:2}. {name:40s} {score:3d}  {label}")
    print()

    # Per-signal analysis
    print(f"--- PER-SIGNAL ANALYSIS ---")
    print(f"{'Signal':<25s} {'Cust Avg':>10s} {'Non-Cust Avg':>13s} {'Separation':>12s} {'Weight':>8s}")
    print("-" * 70)

    signal_separations = []
    for signal in WEIGHTS:
        cust_vals = [c["signals"][signal]["score"] for c in customers]
        non_cust_vals = [c["signals"][signal]["score"] for c in non_customers]
        cust_avg = avg(cust_vals)
        non_cust_avg = avg(non_cust_vals)
        sep = round(cust_avg - non_cust_avg, 2)
        signal_separations.append((signal, cust_avg, non_cust_avg, sep, WEIGHTS[signal]))

    # Sort by separation descending
    signal_separations.sort(key=lambda x: x[3], reverse=True)
    for signal, cust_avg, non_cust_avg, sep, weight in signal_separations:
        indicator = "***" if sep > 0.5 else "**" if sep > 0.3 else "*" if sep > 0.1 else ""
        print(f"  {signal:<23s} {cust_avg:>8.1f}   {non_cust_avg:>10.1f}   {sep:>+10.2f}   {weight:>5d}x  {indicator}")
    print()
    print("  *** = strong separation (>0.5)  ** = moderate (>0.3)  * = weak (>0.1)")
    print()

    # Score distribution
    print(f"--- SCORE DISTRIBUTION ---")
    brackets = [(0, 20), (21, 40), (41, 60), (61, 80), (81, 100)]
    for low, high in brackets:
        cust_count = sum(1 for _, s in cust_scores if low <= s <= high)
        non_count = sum(1 for _, s in non_cust_scores if low <= s <= high)
        print(f"  {low:>3d}-{high:<3d}: {cust_count:>2d} customers, {non_count:>2d} non-customers")
    print()

    # Full ranked list
    print(f"--- FULL RANKED LIST ---")
    for i, (name, score, is_cust) in enumerate(all_scores, 1):
        label = "CUSTOMER" if is_cust else ""
        print(f"  {i:3d}. {name:45s} {score:3d}  {label}")

if __name__ == "__main__":
    main()
