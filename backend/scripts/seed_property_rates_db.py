import os
import sys
import csv

sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from app.database import engine, SessionLocal, Base
from app.models import PropertyRate

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(SCRIPT_DIR, "..", "..", "data", "raw")
CSV_PATH = os.path.join(DATA_DIR, "property_rates_seed.csv")


def main():
    print("Creating tables if not exist...")
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()
    try:
        count = db.query(PropertyRate).count()
        if count > 0:
            print(f"Database already has {count} property rates. Skipping seed.")
            return

        if not os.path.exists(CSV_PATH):
            print(f"CSV not found at {CSV_PATH}")
            print("Run seed_property_rates.py first to generate the CSV.")
            sys.exit(1)

        with open(CSV_PATH, "r", encoding="utf-8") as f:
            reader = csv.DictReader(f)
            rows = list(reader)

        print(f"Seeding {len(rows)} property rate entries...")
        for row in rows:
            record = PropertyRate(
                state=row["state"],
                district=row["district"],
                property_type=row["property_type"],
                rate_per_sqft=float(row["rate_per_sqft"]),
                source=row.get("source", ""),
            )
            db.add(record)

        db.commit()
        print(f"Successfully seeded {len(rows)} property rates.")
    finally:
        db.close()


if __name__ == "__main__":
    main()
