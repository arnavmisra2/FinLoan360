import os
import sys

sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from app.database import engine, SessionLocal, Base
from app.models import (
    User, LoanPrediction, CollateralAssessment, PropertyRate,
    MonthlyIncome, Expense, SavingsPlan, CreditScoreAssessment, ModelVersion,
)


def main():
    print("Initializing database schema...")
    Base.metadata.create_all(bind=engine)
    print("All tables created successfully.")

    db = SessionLocal()
    try:
        tables = [
            "users", "loan_predictions", "collateral_assessments",
            "property_rates", "monthly_income", "expenses",
            "savings_plans", "credit_score_assessments", "model_versions",
        ]
        from sqlalchemy import inspect
        inspector = inspect(engine)
        existing = inspector.get_table_names()
        for t in tables:
            status = "EXISTS" if t in existing else "MISSING"
            print(f"  {t}: {status}")
    finally:
        db.close()

    print("\nDatabase initialization complete.")


if __name__ == "__main__":
    main()
