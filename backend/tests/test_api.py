import os
import sys
import pytest

sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

os.environ["DATABASE_URL"] = "sqlite:///./test.db"
os.environ["MODEL_DIR"] = "./models"

from fastapi.testclient import TestClient
from app.main import app
from app.database import engine, Base, SessionLocal
from app.models import User

client = TestClient(app)


@pytest.fixture(autouse=True)
def setup_db():
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)


def test_health_check():
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert "status" in data
    assert "database" in data
    assert "models" in data


def test_create_user():
    response = client.post("/api/users", json={"name": "Test User", "email": "test@example.com"})
    assert response.status_code == 201
    data = response.json()
    assert data["name"] == "Test User"
    assert data["email"] == "test@example.com"
    assert "id" in data


def test_create_duplicate_user():
    client.post("/api/users", json={"name": "User1", "email": "dup@example.com"})
    response = client.post("/api/users", json={"name": "User2", "email": "dup@example.com"})
    assert response.status_code == 201  # Returns existing user
    assert response.json()["email"] == "dup@example.com"


def test_get_user():
    res = client.post("/api/users", json={"name": "Get Me", "email": "getme@example.com"})
    user_id = res.json()["id"]
    response = client.get(f"/api/users/{user_id}")
    assert response.status_code == 200
    assert response.json()["name"] == "Get Me"


def test_get_nonexistent_user():
    response = client.get("/api/users/99999")
    assert response.status_code == 404


def test_loan_predict():
    res = client.post("/api/users", json={"name": "Borrower", "email": "borrow@example.com"})
    user_id = res.json()["id"]

    response = client.post("/api/loan/predict", json={
        "user_id": user_id,
        "age": 35,
        "income": 60000,
        "employment_length": 5,
        "home_ownership": "RENT",
        "loan_amount": 10000,
        "loan_intent": "PERSONAL",
        "credit_history_length": 8,
        "previous_default": 0,
        "interest_rate": 10.5,
    })
    assert response.status_code == 201
    data = response.json()
    assert "approval_probability" in data
    assert "default_probability" in data
    assert "risk_label" in data
    assert data["risk_label"] in ["Low Risk", "Medium Risk", "High Risk"]


def test_loan_predict_invalid_user():
    response = client.post("/api/loan/predict", json={
        "user_id": 99999,
        "age": 35,
        "income": 60000,
        "employment_length": 5,
        "home_ownership": "RENT",
        "loan_amount": 10000,
        "loan_intent": "PERSONAL",
        "credit_history_length": 8,
        "previous_default": 0,
    })
    assert response.status_code == 404


def test_collateral_assess():
    res = client.post("/api/users", json={"name": "Owner", "email": "owner@example.com"})
    user_id = res.json()["id"]

    response = client.post("/api/collateral/assess", json={
        "user_id": user_id,
        "state": "Maharashtra",
        "district": "Mumbai",
        "area_sqft": 1000,
        "property_type": "residential",
        "requested_loan": 1000000,
    })
    assert response.status_code == 201
    data = response.json()
    assert data["collateral_value"] > 0
    assert data["max_eligible_loan"] > 0
    assert data["ltv_ratio"] > 0
    assert data["status"] in ["approved", "conditional", "rejected"]


def test_add_income():
    res = client.post("/api/users", json={"name": "Earner", "email": "earner@example.com"})
    user_id = res.json()["id"]

    response = client.post("/api/income", json={
        "user_id": user_id,
        "month": "2026-01",
        "income": 5000,
    })
    assert response.status_code == 201
    assert response.json()["income"] == 5000


def test_add_and_get_expenses():
    res = client.post("/api/users", json={"name": "Spender", "email": "spender@example.com"})
    user_id = res.json()["id"]

    client.post("/api/income", json={"user_id": user_id, "month": "2026-01", "income": 5000})

    exp_res = client.post("/api/expenses", json={
        "user_id": user_id,
        "month": "2026-01",
        "category": "Food",
        "amount": 800,
        "note": "Groceries",
    })
    assert exp_res.status_code == 201

    get_res = client.get(f"/api/expenses/{user_id}/2026-01")
    assert get_res.status_code == 200
    assert len(get_res.json()) == 1
    assert get_res.json()[0]["category"] == "Food"


def test_monthly_summary():
    res = client.post("/api/users", json={"name": "Summarizer", "email": "sum@example.com"})
    user_id = res.json()["id"]

    client.post("/api/income", json={"user_id": user_id, "month": "2026-01", "income": 5000})
    client.post("/api/expenses", json={"user_id": user_id, "month": "2026-01", "category": "Food", "amount": 800})
    client.post("/api/expenses", json={"user_id": user_id, "month": "2026-01", "category": "Rent", "amount": 1500})

    response = client.get(f"/api/summary/{user_id}/2026-01")
    assert response.status_code == 200
    data = response.json()
    assert data["income"] == 5000
    assert data["total_expenses"] == 2300
    assert data["disposable_income"] == 2700
    assert "Food" in data["category_breakdown"]


def test_credit_score_analyze():
    res = client.post("/api/users", json={"name": "CreditUser", "email": "credit@example.com"})
    user_id = res.json()["id"]

    response = client.post("/api/credit-score/analyze", json={
        "user_id": user_id,
        "delayed_payments": 3,
        "outstanding_debt": 5000,
        "credit_utilization": 0.4,
        "emi": 500,
        "credit_history_age": 36,
        "monthly_balance": 2000,
        "num_loans": 2,
        "num_credit_cards": 3,
        "annual_income": 60000,
        "monthly_salary": 5000,
        "bank_accounts": 2,
        "amount_invested_monthly": 300,
    })
    assert response.status_code == 201
    data = response.json()
    assert data["predicted_score_class"] in ["Good", "Standard", "Poor"]
    assert isinstance(data["suggestions"], list)


def test_savings_recommend():
    res = client.post("/api/users", json={"name": "Saver", "email": "saver@example.com"})
    user_id = res.json()["id"]

    client.post("/api/income", json={"user_id": user_id, "month": "2026-01", "income": 6000})
    client.post("/api/expenses", json={"user_id": user_id, "month": "2026-01", "category": "Food", "amount": 1000})
    client.post("/api/expenses", json={"user_id": user_id, "month": "2026-01", "category": "Rent", "amount": 2000})

    response = client.post("/api/savings/recommend", json={
        "user_id": user_id,
        "month": "2026-01",
        "risk_profile": "moderate",
    })
    assert response.status_code == 200
    data = response.json()
    assert data["income"] == 6000
    assert data["total_expenses"] == 3000
    assert data["suggested_savings"] > 0
    assert "emergency_fund_target" in data
    assert "suggested_investment" in data


def test_loan_history():
    res = client.post("/api/users", json={"name": "HistoryUser", "email": "hist@example.com"})
    user_id = res.json()["id"]

    client.post("/api/loan/predict", json={
        "user_id": user_id, "age": 30, "income": 50000, "employment_length": 3,
        "home_ownership": "RENT", "loan_amount": 8000, "loan_intent": "PERSONAL",
        "credit_history_length": 5, "previous_default": 0,
    })

    response = client.get(f"/api/loan/history/{user_id}")
    assert response.status_code == 200
    assert len(response.json()) == 1
