"""
Trim non-customer dataset from 200 to 176 to achieve 20% base rate (44/220).
Random sampling, proportional to size buckets.
"""
import json
import random
from pathlib import Path

random.seed(42)  # reproducible

INPUT = Path(__file__).parent.parent / "data" / "raw" / "all_companies.json"
OUTPUT = Path(__file__).parent.parent / "data" / "raw" / "non_customers_176.json"

with open(INPUT) as f:
    companies = json.load(f)

print(f"Starting with {len(companies)} companies")

# Group by size bucket
buckets = {}
for c in companies:
    bucket = c["size_bucket"]
    buckets.setdefault(bucket, []).append(c)

print("\nCurrent distribution:")
for bucket, cos in sorted(buckets.items()):
    print(f"  {bucket}: {len(cos)}")

# Target: 176 total. Cut 24.
# Proportional cuts per bucket
target_total = 176
cut_total = len(companies) - target_total

trimmed = []
for bucket, cos in sorted(buckets.items()):
    # Proportional number to keep
    keep_n = round(len(cos) * target_total / len(companies))
    random.shuffle(cos)
    trimmed.extend(cos[:keep_n])

# Adjust if rounding got us off target
if len(trimmed) > target_total:
    random.shuffle(trimmed)
    trimmed = trimmed[:target_total]
elif len(trimmed) < target_total:
    # Add back from the cut companies
    used = {c["domain"] for c in trimmed}
    remaining = [c for c in companies if c["domain"] not in used]
    random.shuffle(remaining)
    trimmed.extend(remaining[:target_total - len(trimmed)])

# Final distribution
final_buckets = {}
for c in trimmed:
    bucket = c["size_bucket"]
    final_buckets.setdefault(bucket, []).append(c)

print(f"\nTrimmed to {len(trimmed)} companies")
print("\nFinal distribution:")
for bucket, cos in sorted(final_buckets.items()):
    print(f"  {bucket}: {len(cos)}")

print(f"\nWith 44 known customers: {len(trimmed) + 44} total")
print(f"Base rate: {44 / (len(trimmed) + 44):.1%}")

with open(OUTPUT, "w") as f:
    json.dump(trimmed, f, indent=2)
print(f"\nSaved to {OUTPUT}")
