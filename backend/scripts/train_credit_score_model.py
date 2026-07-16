import os
import sys
import pandas as pd
import numpy as np
import joblib
from sklearn.model_selection import train_test_split
from sklearn.ensemble import GradientBoostingClassifier
from sklearn.pipeline import Pipeline
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import OneHotEncoder, StandardScaler, LabelEncoder
from sklearn.metrics import (
    accuracy_score, precision_score, recall_score, f1_score, roc_auc_score,
    classification_report
)

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(SCRIPT_DIR, "..", "..", "data", "raw")
MODEL_DIR = os.path.join(SCRIPT_DIR, "..", "models")
os.makedirs(MODEL_DIR, exist_ok=True)


def load_data():
    path = os.path.join(DATA_DIR, "credit_score_classification.csv")
    if not os.path.exists(path):
        print(f"ERROR: Dataset not found at {path}")
        print("Download from: https://www.kaggle.com/datasets/parisrohan/credit-score-classification")
        print("Place as: data/raw/credit_score_classification.csv")
        sys.exit(1)

    df = pd.read_csv(path)
    print(f"Loaded {len(df)} rows from credit_score_classification.csv")
    return df


def clean_data(df):
    original_len = len(df)

    target_col = "Credit_Score"
    if target_col not in df.columns:
        print(f"ERROR: Target column '{target_col}' not found. Available: {list(df.columns)}")
        sys.exit(1)

    numeric_candidates = [
        "Annual_Income", "Monthly_Inhand_Salary", "Num_Bank_Accounts",
        "Num_Credit_Card", "Delay_from_due_date", "Outstanding_Debt",
        "Credit_Utilization_Ratio", "Total_EMI_per_month",
        "Amount_invested_monthly", "Monthly_Balance", "Credit_History_Age",
        "Num_Loan", "Changed_Credit_Limit", "Num_Credit_Inquiries",
        "Amount_invested_monthly", "Monthly_Balance",
    ]

    for col in numeric_candidates:
        if col in df.columns:
            df[col] = pd.to_numeric(df[col], errors="coerce")

    cat_cols_to_drop = ["ID", "Customer_ID", "Month", "Name", "SSN", "Occupation"]
    for col in cat_cols_to_drop:
        if col in df.columns:
            df.drop(columns=[col], inplace=True)

    df = df.dropna()

    for col in df.select_dtypes(include=[np.number]).columns:
        df = df[df[col] >= 0]

    df = df.reset_index(drop=True)

    print(f"Cleaned: {original_len} -> {len(df)} rows")
    return df


def train(df):
    target = "Credit_Score"
    exclude_cols = [target]
    feature_cols = [c for c in df.columns if c not in exclude_cols]

    X = df[feature_cols]
    y = df[target]

    le = LabelEncoder()
    y_encoded = le.fit_transform(y)
    class_names = le.classes_.tolist()

    print(f"\nTarget distribution: {dict(zip(class_names, np.bincount(y_encoded)))}")
    print(f"Features: {feature_cols}")

    categorical = X.select_dtypes(include=["object"]).columns.tolist()
    numerical = X.select_dtypes(include=[np.number]).columns.tolist()

    X_train, X_test, y_train, y_test = train_test_split(
        X, y_encoded, test_size=0.2, random_state=42, stratify=y_encoded
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

    print("\nTraining GradientBoosting classifier for credit score...")
    pipeline.fit(X_train, y_train)

    y_pred = pipeline.predict(X_test)
    y_proba = pipeline.predict_proba(X_test)

    accuracy = accuracy_score(y_test, y_pred)
    precision = precision_score(y_test, y_pred, average="weighted", zero_division=0)
    recall = recall_score(y_test, y_pred, average="weighted", zero_division=0)
    f1 = f1_score(y_test, y_pred, average="weighted", zero_division=0)

    n_classes = len(class_names)
    if n_classes == 2:
        roc = roc_auc_score(y_test, y_proba[:, 1])
    else:
        roc = roc_auc_score(y_test, y_proba, multi_class="ovr", average="weighted")

    print(f"\n{'='*50}")
    print(f"Credit Score Model Metrics:")
    print(f"  Accuracy:  {accuracy:.4f}")
    print(f"  Precision: {precision:.4f}")
    print(f"  Recall:    {recall:.4f}")
    print(f"  F1 Score:  {f1:.4f}")
    print(f"  ROC-AUC:   {roc:.4f}")
    print(f"{'='*50}")
    print(f"\nClassification Report:\n{classification_report(y_test, y_pred, target_names=class_names)}")

    model_bundle = {
        "pipeline": pipeline,
        "label_encoder": le,
        "feature_columns": feature_cols,
        "class_names": class_names,
    }

    model_path = os.path.join(MODEL_DIR, "credit_score_model.joblib")
    joblib.dump(model_bundle, model_path)
    print(f"\nModel saved to: {model_path}")

    metrics_path = os.path.join(MODEL_DIR, "credit_score_model_metrics.txt")
    with open(metrics_path, "w") as f:
        f.write(f"Model: GradientBoostingClassifier\n")
        f.write(f"Dataset: credit_score_classification.csv\n")
        f.write(f"Rows used: {len(df)}\n")
        f.write(f"Classes: {class_names}\n")
        f.write(f"Accuracy: {accuracy:.4f}\n")
        f.write(f"Precision: {precision:.4f}\n")
        f.write(f"Recall: {recall:.4f}\n")
        f.write(f"F1 Score: {f1:.4f}\n")
        f.write(f"ROC-AUC: {roc:.4f}\n")
    print(f"Metrics saved to: {metrics_path}")

    return accuracy, roc, f1


if __name__ == "__main__":
    print("=" * 60)
    print("FinLoan360 - Credit Score Model Training")
    print("=" * 60)
    df = load_data()
    df = clean_data(df)
    accuracy, roc_auc, f1 = train(df)
    print(f"\nTraining complete. Metrics: acc={accuracy:.4f}, roc={roc_auc:.4f}, f1={f1:.4f}")
