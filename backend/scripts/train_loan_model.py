import os
import sys
import pandas as pd
import numpy as np
import joblib
from sklearn.model_selection import train_test_split
from sklearn.ensemble import GradientBoostingClassifier
from sklearn.pipeline import Pipeline
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.metrics import (
    accuracy_score, precision_score, recall_score, f1_score, roc_auc_score,
    classification_report
)

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(SCRIPT_DIR, "..", "..", "data", "raw")
MODEL_DIR = os.path.join(SCRIPT_DIR, "..", "models")
os.makedirs(MODEL_DIR, exist_ok=True)


def load_data():
    path = os.path.join(DATA_DIR, "credit_risk_dataset.csv")
    if not os.path.exists(path):
        print(f"ERROR: Dataset not found at {path}")
        print("Download from: https://www.kaggle.com/datasets/laotse/credit-risk-dataset")
        print("Place as: data/raw/credit_risk_dataset.csv")
        sys.exit(1)

    df = pd.read_csv(path)
    print(f"Loaded {len(df)} rows from credit_risk_dataset.csv")
    return df


def clean_data(df):
    original_len = len(df)

    numeric_cols = df.select_dtypes(include=[np.number]).columns
    for col in numeric_cols:
        df = df[df[col] >= 0]

    df = df.dropna(subset=["loan_status"])

    for col in ["person_age", "person_emp_length", "person_income", "loan_amnt",
                "loan_interest_rate", "loan_percent_income", "cb_person_cred_hist_length"]:
        if col in df.columns:
            df[col] = pd.to_numeric(df[col], errors="coerce")

    df = df.dropna()

    print(f"Cleaned: {original_len} -> {len(df)} rows (dropped {original_len - len(df)} invalid rows)")
    return df


def train(df):
    target = "loan_status"
    features = [
        "person_age", "person_income", "person_emp_length",
        "person_home_ownership", "loan_amnt", "loan_intent",
        "loan_percent_income", "cb_person_default_on_file",
        "cb_person_cred_hist_length",
    ]

    available_features = [f for f in features if f in df.columns]
    missing = [f for f in features if f not in df.columns]
    if missing:
        print(f"Warning: Missing features: {missing}")

    X = df[available_features]
    y = df[target]

    print(f"\nFeature distribution:")
    print(f"  Target 'loan_status': {y.value_counts().to_dict()}")
    print(f"  Features used: {available_features}")

    categorical = X.select_dtypes(include=["object"]).columns.tolist()
    numerical = X.select_dtypes(include=[np.number]).columns.tolist()

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )

    preprocessor = ColumnTransformer(
        transformers=[
            ("cat", OneHotEncoder(handle_unknown="ignore", sparse_output=False), categorical),
            ("num", StandardScaler(), numerical),
        ],
        remainder="drop",
    )

    pipeline = Pipeline([
        ("preprocessor", preprocessor),
        ("classifier", GradientBoostingClassifier(
            n_estimators=200,
            learning_rate=0.1,
            max_depth=5,
            random_state=42,
        )),
    ])

    print("\nTraining GradientBoosting classifier...")
    pipeline.fit(X_train, y_train)

    y_pred = pipeline.predict(X_test)
    y_proba = pipeline.predict_proba(X_test)

    accuracy = accuracy_score(y_test, y_pred)
    precision = precision_score(y_test, y_pred, average="weighted", zero_division=0)
    recall = recall_score(y_test, y_pred, average="weighted", zero_division=0)
    f1 = f1_score(y_test, y_pred, average="weighted", zero_division=0)

    if y_proba.shape[1] == 2:
        roc = roc_auc_score(y_test, y_proba[:, 1])
    else:
        roc = roc_auc_score(y_test, y_proba, multi_class="ovr", average="weighted")

    print(f"\n{'='*50}")
    print(f"Loan Risk Model Metrics:")
    print(f"  Accuracy:  {accuracy:.4f}")
    print(f"  Precision: {precision:.4f}")
    print(f"  Recall:    {recall:.4f}")
    print(f"  F1 Score:  {f1:.4f}")
    print(f"  ROC-AUC:   {roc:.4f}")
    print(f"{'='*50}")
    print(f"\nClassification Report:\n{classification_report(y_test, y_pred)}")

    model_path = os.path.join(MODEL_DIR, "loan_risk_model.joblib")
    joblib.dump(pipeline, model_path)
    print(f"\nModel saved to: {model_path}")

    metrics_path = os.path.join(MODEL_DIR, "loan_model_metrics.txt")
    with open(metrics_path, "w") as f:
        f.write(f"Model: GradientBoostingClassifier\n")
        f.write(f"Dataset: credit_risk_dataset.csv\n")
        f.write(f"Rows used: {len(df)}\n")
        f.write(f"Accuracy: {accuracy:.4f}\n")
        f.write(f"Precision: {precision:.4f}\n")
        f.write(f"Recall: {recall:.4f}\n")
        f.write(f"F1 Score: {f1:.4f}\n")
        f.write(f"ROC-AUC: {roc:.4f}\n")
    print(f"Metrics saved to: {metrics_path}")

    return accuracy, roc, f1


if __name__ == "__main__":
    print("=" * 60)
    print("FinLoan360 - Loan Risk Model Training")
    print("=" * 60)
    df = load_data()
    df = clean_data(df)
    accuracy, roc_auc, f1 = train(df)
    print(f"\nTraining complete. Metrics: acc={accuracy:.4f}, roc={roc_auc:.4f}, f1={f1:.4f}")
