import pandas as pd
import numpy as np
import os

np.random.seed(42)

# Generate synthetic credit score data
n = 20000

data = {
    "ID": range(1, n + 1),
    "Customer_ID": [f"CUST_{i:06d}" for i in range(1, n + 1)],
    "Name": [f"User_{i}" for i in range(1, n + 1)],
    "Age": np.random.randint(18, 70, n),
    "SSN": [f"{np.random.randint(100, 999)}-{np.random.randint(10, 99)}-{np.random.randint(1000, 9999)}" for _ in range(n)],
    "Occupation": np.random.choice(["Salaried", "Self-Employed", "Student", "Retired", "Unemployed"], n, p=[0.5, 0.2, 0.1, 0.1, 0.1]),
    "Annual_Income": np.random.lognormal(10.5, 0.5, n).astype(int),
    "Monthly_Inhand_Salary": lambda x: (x["Annual_Income"] / 12 * np.random.uniform(0.7, 1.0, n)).astype(int),
    "Num_Bank_Accounts": np.random.poisson(2, n) + 1,
    "Num_Credit_Card": np.random.poisson(1, n) + 1,
    "Interest_Rate": np.random.uniform(5, 25, n).round(1),
    "Num_of_Loan": np.random.poisson(1, n),
    "Type_of_Loan": np.random.choice(["Auto Loan", "Home Loan", "Personal Loan", "Credit Card", "Student Loan", "Not Specified"], n),
    "Delay_from_due_date": np.random.poisson(3, n),
    "Num_of_Delayed_Payment": np.random.poisson(2, n),
    "Changed_Credit_Limit": np.random.uniform(0, 50, n).round(1),
    "Num_Credit_Inquiries": np.random.poisson(2, n),
    "Credit_Mix": np.random.choice(["Good", "Standard", "Bad"], n, p=[0.3, 0.5, 0.2]),
    "Outstanding_Debt": np.random.lognormal(8, 1, n).astype(int),
    "Credit_Utilization_Ratio": np.random.beta(2, 5, n),
    "Credit_History_Age": np.random.exponential(60, n).astype(int).clip(0, 600),
    "Payment_of_Min_Amount": np.random.choice(["Yes", "No"], n, p=[0.7, 0.3]),
    "Total_EMI_per_month": np.random.lognormal(6, 0.8, n).astype(int),
    "Amount_invested_monthly": np.random.lognormal(5, 1, n).astype(int),
    "Payment_Behaviour": np.random.choice(["High_spent_Small_value_payments", "Low_spent_Large_value_payments", "Low_spent_Medium_value_payments", "High_spent_Medium_value_payments"], n),
    "Monthly_Balance": lambda x: (x["Monthly_Inhand_Salary"] - x["Total_EMI_per_month"] - x["Amount_invested_monthly"] + np.random.normal(0, 500, n)).astype(int),
    "Credit_Score": np.random.choice(["Poor", "Standard", "Good"], n, p=[0.25, 0.5, 0.25]),
}

# Build DataFrame with lambda columns evaluated
df = pd.DataFrame()
for col, val in data.items():
    if callable(val):
        df[col] = val(df)
    else:
        df[col] = val

# Ensure Monthly_Balance is reasonable
df["Monthly_Balance"] = df["Monthly_Balance"].clip(-5000, 20000)

# Save to CSV
output_path = "data/raw/credit_score_classification.csv"
os.makedirs(os.path.dirname(output_path), exist_ok=True)
df.to_csv(output_path, index=False)
print(f"Generated {len(df)} synthetic credit score records at {output_path}")
print(f"Credit_Score distribution: {df['Credit_Score'].value_counts().to_dict()}")