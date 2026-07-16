import os
import joblib
import numpy as np
import pandas as pd
from typing import Tuple, Dict, Any, Optional

MODEL_DIR = os.getenv("MODEL_DIR", "./models")


def _model_path(name: str) -> str:
    return os.path.join(MODEL_DIR, f"{name}.joblib")


def load_model(name: str) -> Optional[Any]:
    path = _model_path(name)
    if os.path.exists(path):
        return joblib.load(path)
    return None


def risk_label(probability: float) -> str:
    if probability < 0.25:
        return "Low Risk"
    elif probability <= 0.60:
        return "Medium Risk"
    else:
        return "High Risk"


def predict_loan_risk(inputs: Dict[str, Any]) -> Dict[str, Any]:
    model = load_model("loan_risk_model")
    if model is None:
        return _fallback_loan_prediction(inputs)

    feature_order = [
        "person_age",
        "person_income",
        "person_emp_length",
        "person_home_ownership",
        "loan_amnt",
        "loan_intent",
        "loan_percent_income",
        "cb_person_default_on_file",
        "cb_person_cred_hist_length",
    ]

    loan_percent = inputs["loan_amount"] / inputs["income"] if inputs["income"] > 0 else 0.0

    row = {
        "person_age": inputs["age"],
        "person_income": inputs["income"],
        "person_emp_length": inputs["employment_length"],
        "person_home_ownership": inputs["home_ownership"],
        "loan_amnt": inputs["loan_amount"],
        "loan_intent": inputs["loan_intent"],
        "loan_percent_income": round(loan_percent, 4),
        "cb_person_default_on_file": "Y" if inputs["previous_default"] else "N",
        "cb_person_cred_hist_length": inputs["credit_history_length"],
    }

    df = pd.DataFrame([row])

    try:
        proba = model.predict_proba(df)[0]
        default_prob = float(proba[1]) if len(proba) > 1 else float(proba[0])
        approval_prob = 1.0 - default_prob
    except Exception:
        return _fallback_loan_prediction(inputs)

    label = risk_label(default_prob)
    factors = _extract_risk_factors(inputs, loan_percent, default_prob)

    return {
        "approval_probability": round(approval_prob, 4),
        "default_probability": round(default_prob, 4),
        "risk_label": label,
        "risk_factors": factors,
    }


def _extract_risk_factors(
    inputs: Dict[str, Any], loan_percent: float, default_prob: float
) -> list:
    factors = []
    if inputs.get("previous_default"):
        factors.append("Previous loan default on record")
    if loan_percent > 0.36:
        factors.append(f"High loan-to-income ratio ({loan_percent:.1%})")
    if inputs.get("credit_history_length", 0) < 2:
        factors.append("Short credit history (< 2 years)")
    if inputs.get("employment_length", 0) < 1:
        factors.append("Less than 1 year of employment")
    if inputs.get("income", 0) < 25000:
        factors.append("Annual income below $25,000")
    if inputs.get("interest_rate") and inputs["interest_rate"] > 15:
        factors.append(f"High interest rate ({inputs['interest_rate']}%)")
    if default_prob > 0.5:
        factors.append("Overall model confidence indicates elevated risk")
    if not factors:
        factors.append("No major risk factors identified")
    return factors


def _fallback_loan_prediction(inputs: Dict[str, Any]) -> Dict[str, Any]:
    score = 0.0
    factors = []
    loan_percent = inputs["loan_amount"] / inputs["income"] if inputs["income"] > 0 else 0

    if inputs.get("previous_default"):
        score += 0.3
        factors.append("Previous loan default on record")
    if loan_percent > 0.36:
        score += 0.2
        factors.append(f"High loan-to-income ratio ({loan_percent:.1%})")
    if inputs.get("credit_history_length", 0) < 2:
        score += 0.15
        factors.append("Short credit history")
    if inputs.get("employment_length", 0) < 1:
        score += 0.1
        factors.append("Less than 1 year employment")
    if inputs.get("income", 0) < 25000:
        score += 0.1
        factors.append("Low annual income")

    default_prob = min(score, 0.95)
    approval_prob = 1.0 - default_prob

    if not factors:
        factors.append("No major risk factors identified")

    return {
        "approval_probability": round(approval_prob, 4),
        "default_probability": round(default_prob, 4),
        "risk_label": risk_label(default_prob),
        "risk_factors": factors,
    }


def predict_credit_score(inputs: Dict[str, Any]) -> Dict[str, Any]:
    model = load_model("credit_score_model")
    if model is None:
        return _fallback_credit_score(inputs)

    if isinstance(model, dict) and "pipeline" in model:
        pipeline = model["pipeline"]
        label_encoder = model.get("label_encoder")
    else:
        pipeline = model
        label_encoder = None

    row = {
        "Annual_Income": inputs.get("annual_income", 0),
        "Monthly_Inhand_Salary": inputs.get("monthly_salary", 0),
        "Num_Bank_Accounts": inputs.get("bank_accounts", 0),
        "Num_Credit_Card": inputs.get("num_credit_cards", 0),
        "Delay_from_due_date": inputs.get("delayed_payments", 0),
        "Outstanding_Debt": inputs.get("outstanding_debt", 0),
        "Credit_Utilization_Ratio": inputs.get("credit_utilization", 0),
        "Total_EMI_per_month": inputs.get("emi", 0),
        "Amount_invested_monthly": inputs.get("amount_invested_monthly", 0),
        "Monthly_Balance": inputs.get("monthly_balance", 0),
        "Credit_History_Age": inputs.get("credit_history_age", 0),
        "Num_Loan": inputs.get("num_loans", 0),
    }

    df = pd.DataFrame([row])

    try:
        prediction_encoded = pipeline.predict(df)[0]
        if label_encoder is not None:
            predicted_class = str(label_encoder.inverse_transform([prediction_encoded])[0])
        else:
            predicted_class = str(prediction_encoded)
    except Exception:
        return _fallback_credit_score(inputs)

    suggestions = _credit_improvement_suggestions(inputs, predicted_class)

    return {
        "predicted_score_class": predicted_class,
        "suggestions": suggestions,
    }


def _credit_improvement_suggestions(
    inputs: Dict[str, Any], predicted_class: str
) -> list:
    suggestions = []
    if inputs.get("delayed_payments", 0) > 5:
        suggestions.append(
            "Reduce delayed payments — set up auto-pay for all bills and EMIs."
        )
    if inputs.get("outstanding_debt", 0) > inputs.get("monthly_salary", 1) * 5:
        suggestions.append(
            "Outstanding debt exceeds 5x monthly salary — prioritize debt consolidation."
        )
    if inputs.get("credit_utilization", 0) > 0.5:
        suggestions.append(
            "Credit utilization above 50% — pay down balances to below 30% utilization."
        )
    if inputs.get("emi", 0) > inputs.get("monthly_salary", 1) * 0.4:
        suggestions.append(
            "EMI burden exceeds 40% of salary — avoid taking new loans until EMI ratio drops."
        )
    if inputs.get("credit_history_age", 0) < 24:
        suggestions.append(
            "Credit history less than 2 years — maintain old accounts to build history."
        )
    if inputs.get("monthly_balance", 0) < 0:
        suggestions.append(
            "Negative monthly balance detected — reduce expenses or increase income."
        )
    if inputs.get("num_loans", 0) > 5:
        suggestions.append(
            "Many active loans — consolidate where possible to reduce burden."
        )
    if predicted_class == "Good":
        suggestions.append(
            "Great job! Maintain consistent payments and low utilization."
        )
    elif predicted_class == "Standard":
        suggestions.append(
            "You are in the standard range — focus on reducing debt and on-time payments."
        )
    if not suggestions:
        suggestions.append(
            "Continue maintaining healthy financial habits: pay on time, keep utilization low."
        )
    return suggestions


def _fallback_credit_score(inputs: Dict[str, Any]) -> Dict[str, Any]:
    score = 500
    factors = []

    score += min(inputs.get("credit_history_age", 0) * 0.5, 50)
    score -= min(inputs.get("delayed_payments", 0) * 10, 80)
    score -= min(inputs.get("outstanding_debt", 0) / 1000, 50)

    util = inputs.get("credit_utilization", 0)
    if util > 0.5:
        score -= 30
    elif util > 0.3:
        score -= 15

    balance = inputs.get("monthly_balance", 0)
    if balance > 0:
        score += 20
    elif balance < 0:
        score -= 30

    if score >= 750:
        predicted_class = "Good"
    elif score >= 650:
        predicted_class = "Standard"
    else:
        predicted_class = "Poor"

    suggestions = _credit_improvement_suggestions(inputs, predicted_class)

    return {
        "predicted_score_class": predicted_class,
        "suggestions": suggestions,
    }


def get_model_info() -> Dict[str, Any]:
    models = {}
    for name in ["loan_risk_model", "credit_score_model"]:
        path = _model_path(name)
        models[name] = os.path.exists(path)
    return models
