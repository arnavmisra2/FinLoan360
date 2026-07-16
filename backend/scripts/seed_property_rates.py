import os
import sys
import csv

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(SCRIPT_DIR, "..", "..", "data", "raw")
os.makedirs(DATA_DIR, exist_ok=True)

PROPERTY_RATES = [
    {"state": "Maharashtra", "district": "Mumbai", "property_type": "residential", "rate_per_sqft": 18500, "source": "NHB Residex / Market Estimate"},
    {"state": "Maharashtra", "district": "Mumbai", "property_type": "commercial", "rate_per_sqft": 32000, "source": "NHB Residex / Market Estimate"},
    {"state": "Maharashtra", "district": "Mumbai", "property_type": "industrial", "rate_per_sqft": 22000, "source": "NHB Residex / Market Estimate"},
    {"state": "Maharashtra", "district": "Mumbai", "property_type": "agricultural", "rate_per_sqft": 5000, "source": "NHB Residex / Market Estimate"},
    {"state": "Maharashtra", "district": "Pune", "property_type": "residential", "rate_per_sqft": 7500, "source": "NHB Residex / Market Estimate"},
    {"state": "Maharashtra", "district": "Pune", "property_type": "commercial", "rate_per_sqft": 12000, "source": "NHB Residex / Market Estimate"},
    {"state": "Maharashtra", "district": "Pune", "property_type": "industrial", "rate_per_sqft": 8000, "source": "NHB Residex / Market Estimate"},
    {"state": "Maharashtra", "district": "Nagpur", "property_type": "residential", "rate_per_sqft": 4500, "source": "NHB Residex / Market Estimate"},
    {"state": "Maharashtra", "district": "Nagpur", "property_type": "commercial", "rate_per_sqft": 7000, "source": "NHB Residex / Market Estimate"},
    {"state": "Karnataka", "district": "Bengaluru", "property_type": "residential", "rate_per_sqft": 9500, "source": "NHB Residex / Market Estimate"},
    {"state": "Karnataka", "district": "Bengaluru", "property_type": "commercial", "rate_per_sqft": 15000, "source": "NHB Residex / Market Estimate"},
    {"state": "Karnataka", "district": "Bengaluru", "property_type": "industrial", "rate_per_sqft": 10000, "source": "NHB Residex / Market Estimate"},
    {"state": "Karnataka", "district": "Mysuru", "property_type": "residential", "rate_per_sqft": 5000, "source": "NHB Residex / Market Estimate"},
    {"state": "Delhi", "district": "New Delhi", "property_type": "residential", "rate_per_sqft": 15000, "source": "NHB Residex / Market Estimate"},
    {"state": "Delhi", "district": "New Delhi", "property_type": "commercial", "rate_per_sqft": 28000, "source": "NHB Residex / Market Estimate"},
    {"state": "Tamil Nadu", "district": "Chennai", "property_type": "residential", "rate_per_sqft": 8000, "source": "NHB Residex / Market Estimate"},
    {"state": "Tamil Nadu", "district": "Chennai", "property_type": "commercial", "rate_per_sqft": 14000, "source": "NHB Residex / Market Estimate"},
    {"state": "Gujarat", "district": "Ahmedabad", "property_type": "residential", "rate_per_sqft": 5500, "source": "NHB Residex / Market Estimate"},
    {"state": "Gujarat", "district": "Ahmedabad", "property_type": "commercial", "rate_per_sqft": 9000, "source": "NHB Residex / Market Estimate"},
    {"state": "West Bengal", "district": "Kolkata", "property_type": "residential", "rate_per_sqft": 6500, "source": "NHB Residex / Market Estimate"},
    {"state": "West Bengal", "district": "Kolkata", "property_type": "commercial", "rate_per_sqft": 11000, "source": "NHB Residex / Market Estimate"},
    {"state": "Uttar Pradesh", "district": "Lucknow", "property_type": "residential", "rate_per_sqft": 4200, "source": "NHB Residex / Market Estimate"},
    {"state": "Uttar Pradesh", "district": "Noida", "property_type": "residential", "rate_per_sqft": 6000, "source": "NHB Residex / Market Estimate"},
    {"state": "Rajasthan", "district": "Jaipur", "property_type": "residential", "rate_per_sqft": 4800, "source": "NHB Residex / Market Estimate"},
    {"state": "Telangana", "district": "Hyderabad", "property_type": "residential", "rate_per_sqft": 7000, "source": "NHB Residex / Market Estimate"},
    {"state": "Telangana", "district": "Hyderabad", "property_type": "commercial", "rate_per_sqft": 12000, "source": "NHB Residex / Market Estimate"},
    {"state": "Kerala", "district": "Thiruvananthapuram", "property_type": "residential", "rate_per_sqft": 5800, "source": "NHB Residex / Market Estimate"},
    {"state": "Madhya Pradesh", "district": "Bhopal", "property_type": "residential", "rate_per_sqft": 3800, "source": "NHB Residex / Market Estimate"},
    {"state": "Madhya Pradesh", "district": "Indore", "property_type": "residential", "rate_per_sqft": 4200, "source": "NHB Residex / Market Estimate"},
    {"state": "Bihar", "district": "Patna", "property_type": "residential", "rate_per_sqft": 3500, "source": "NHB Residex / Market Estimate"},
    {"state": "Punjab", "district": "Chandigarh", "property_type": "residential", "rate_per_sqft": 7500, "source": "NHB Residex / Market Estimate"},
    {"state": "Haryana", "district": "Gurugram", "property_type": "residential", "rate_per_sqft": 8500, "source": "NHB Residex / Market Estimate"},
    {"state": "Haryana", "district": "Gurugram", "property_type": "commercial", "rate_per_sqft": 14000, "source": "NHB Residex / Market Estimate"},
    {"state": "Andhra Pradesh", "district": "Visakhapatnam", "property_type": "residential", "rate_per_sqft": 4500, "source": "NHB Residex / Market Estimate"},
    {"state": "Odisha", "district": "Bhubaneswar", "property_type": "residential", "rate_per_sqft": 4000, "source": "NHB Residex / Market Estimate"},
    {"state": "Assam", "district": "Guwahati", "property_type": "residential", "rate_per_sqft": 3800, "source": "NHB Residex / Market Estimate"},
    {"state": "Jharkhand", "district": "Ranchi", "property_type": "residential", "rate_per_sqft": 3200, "source": "NHB Residex / Market Estimate"},
    {"state": "Chhattisgarh", "district": "Raipur", "property_type": "residential", "rate_per_sqft": 3000, "source": "NHB Residex / Market Estimate"},
    {"state": "Goa", "district": "Panaji", "property_type": "residential", "rate_per_sqft": 8000, "source": "NHB Residex / Market Estimate"},
    {"state": "Goa", "district": "Panaji", "property_type": "commercial", "rate_per_sqft": 13000, "source": "NHB Residex / Market Estimate"},
]

OUTPUT_CSV = os.path.join(DATA_DIR, "property_rates_seed.csv")
FIELDNAMES = ["state", "district", "property_type", "rate_per_sqft", "source", "effective_date"]


def main():
    print(f"Writing {len(PROPERTY_RATES)} property rate entries to {OUTPUT_CSV}")
    with open(OUTPUT_CSV, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=FIELDNAMES)
        writer.writeheader()
        for row in PROPERTY_RATES:
            row["effective_date"] = "2026-01-01"
            writer.writerow(row)
    print("Done. Use scripts/seed_property_rates.py to insert into MySQL.")


if __name__ == "__main__":
    main()
