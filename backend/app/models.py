from datetime import datetime
from sqlalchemy import (
    Column, Integer, String, Float, Text, DateTime, ForeignKey, JSON
)
from sqlalchemy.orm import relationship
from .database import Base


class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(255), nullable=False)
    email = Column(String(255), unique=True, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    loan_predictions = relationship("LoanPrediction", back_populates="user")
    collateral_assessments = relationship("CollateralAssessment", back_populates="user")
    monthly_incomes = relationship("MonthlyIncome", back_populates="user")
    expenses = relationship("Expense", back_populates="user")
    savings_plans = relationship("SavingsPlan", back_populates="user")
    credit_score_assessments = relationship("CreditScoreAssessment", back_populates="user")


class LoanPrediction(Base):
    __tablename__ = "loan_predictions"
    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    inputs_json = Column(JSON, nullable=False)
    approval_probability = Column(Float, nullable=False)
    default_probability = Column(Float, nullable=False)
    risk_label = Column(String(20), nullable=False)
    risk_factors_json = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="loan_predictions")


class CollateralAssessment(Base):
    __tablename__ = "collateral_assessments"
    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    state = Column(String(100), nullable=False)
    district = Column(String(100), nullable=False)
    area_sqft = Column(Float, nullable=False)
    rate_per_sqft = Column(Float, nullable=False)
    collateral_value = Column(Float, nullable=False)
    requested_loan = Column(Float, nullable=False)
    max_eligible_loan = Column(Float, nullable=False)
    ltv_ratio = Column(Float, nullable=False)
    status = Column(String(20), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="collateral_assessments")


class PropertyRate(Base):
    __tablename__ = "property_rates"
    id = Column(Integer, primary_key=True, autoincrement=True)
    state = Column(String(100), nullable=False)
    district = Column(String(100), nullable=False)
    property_type = Column(String(50), nullable=False)
    rate_per_sqft = Column(Float, nullable=False)
    source = Column(String(255), nullable=True)
    effective_date = Column(DateTime, default=datetime.utcnow)


class MonthlyIncome(Base):
    __tablename__ = "monthly_income"
    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    month = Column(String(7), nullable=False)
    income = Column(Float, nullable=False)

    user = relationship("User", back_populates="monthly_incomes")


class Expense(Base):
    __tablename__ = "expenses"
    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    month = Column(String(7), nullable=False)
    category = Column(String(50), nullable=False)
    amount = Column(Float, nullable=False)
    note = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="expenses")


class SavingsPlan(Base):
    __tablename__ = "savings_plans"
    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    month = Column(String(7), nullable=False)
    savings_rate = Column(Float, nullable=False)
    emergency_fund_target = Column(Float, nullable=False)
    recommendation_json = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="savings_plans")


class CreditScoreAssessment(Base):
    __tablename__ = "credit_score_assessments"
    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    inputs_json = Column(JSON, nullable=False)
    predicted_score_class = Column(String(20), nullable=False)
    suggestions_json = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="credit_score_assessments")


class ModelVersion(Base):
    __tablename__ = "model_versions"
    id = Column(Integer, primary_key=True, autoincrement=True)
    model_name = Column(String(100), nullable=False)
    dataset_name = Column(String(255), nullable=False)
    accuracy = Column(Float, nullable=True)
    roc_auc = Column(Float, nullable=True)
    f1_score = Column(Float, nullable=True)
    model_path = Column(String(500), nullable=False)
    trained_at = Column(DateTime, default=datetime.utcnow)
