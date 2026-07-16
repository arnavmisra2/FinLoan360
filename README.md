# FinLoan360

Full-stack financial risk analysis platform with ML-powered loan prediction, collateral assessment, expense tracking, savings planning, and credit score improvement.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite, Recharts, Axios, React Router |
| Backend | Python FastAPI, SQLAlchemy, Pydantic |
| Database | MySQL 8 |
| ML | pandas, scikit-learn (GradientBoosting), joblib |
| Deployment | Docker Compose |

## Project Structure

```
FinLoan360/
├── frontend/          # React + Vite UI
│   ├── src/
│   │   ├── pages/     # Dashboard, LoanRisk, LandCollateral, ExpenseTracker, etc.
│   │   ├── components/
│   │   ├── services/  # Axios API client
│   │   └── context/   # User context
│   └── package.json
├── backend/           # FastAPI application
│   ├── app/
│   │   ├── main.py           # FastAPI app entry
│   │   ├── database.py       # SQLAlchemy engine/session
│   │   ├── models.py         # ORM models (9 tables)
│   │   ├── schemas.py        # Pydantic validation
│   │   ├── routes/           # API route handlers
│   │   └── services/         # ML + business logic
│   ├── scripts/              # Training & seed scripts
│   ├── models/               # Saved ML models (.joblib)
│   └── requirements.txt
├── data/
│   ├── raw/           # Downloaded Kaggle datasets
│   └── processed/
├── docker-compose.yml
├── .env.example
└── README.md
```

## Datasets

Each dataset is used independently for its own module:

| Dataset | Source | Module | Purpose |
|---------|--------|--------|---------|
| Credit Risk Dataset | [Kaggle](https://www.kaggle.com/datasets/laotse/credit-risk-dataset) | Loan Risk Prediction | Predict loan default probability |
| Credit Score Classification | [Kaggle](https://www.kaggle.com/datasets/parisrohan/credit-score-classification) | Credit Score Improvement | Predict score class, suggest improvements |
| HMEQ Data | [Kaggle](https://www.kaggle.com/datasets/ajay1735/hmeq-data) | Collateral Assessment | Optional collateral risk model |
| NHB Residex | [residex.nhbonline.org.in](https://residex.nhbonline.org.in/) | Property Rates | Seed data for property valuation |

**Important:** Datasets are never merged row-by-row. Each is used in its own training pipeline.

## Setup

### Prerequisites
- Python 3.11+
- Node.js 18+
- MySQL 8 (or Docker)

### Quick Start with Docker

```bash
# Clone and enter the project
cd FinLoan360

# Copy environment files
cp .env.example .env
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# Start everything
docker-compose up --build -d

# Access: http://localhost:5173
```

### Manual Setup

#### 1. Database
```bash
# Create MySQL database
mysql -u root -p -e "CREATE DATABASE finloan360; CREATE USER 'finloan'@'localhost' IDENTIFIED BY 'finloan123'; GRANT ALL ON finloan360.* TO 'finloan'@'localhost';"
```

#### 2. Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt

# Initialize database
python -m scripts.init_db

# Seed property rates
python -m scripts.seed_property_rates
python -m scripts.seed_property_rates_db
```

#### 3. Train ML Models
```bash
# Download datasets to data/raw/:
#   credit_risk_dataset.csv
#   credit_score_classification.csv

# Train loan risk model
python -m scripts.train_loan_model

# Train credit score model
python -m scripts.train_credit_score_model
```

#### 4. Start Backend
```bash
uvicorn app.main:app --reload --port 8000
```

#### 5. Frontend
```bash
cd frontend
npm install
npm run dev
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check (DB + model status) |
| POST | `/api/users` | Register user |
| GET | `/api/users/{id}` | Get user |
| POST | `/api/loan/predict` | Predict loan default risk |
| GET | `/api/loan/history/{user_id}` | Loan prediction history |
| POST | `/api/collateral/assess` | Assess property collateral |
| GET | `/api/collateral/property-rates` | Get property rates |
| POST | `/api/income` | Set monthly income |
| POST | `/api/expenses` | Add expense |
| GET | `/api/expenses/{user_id}/{month}` | Get expenses |
| DELETE | `/api/expenses/{id}` | Delete expense |
| GET | `/api/summary/{user_id}/{month}` | Monthly financial summary |
| POST | `/api/savings/recommend` | Get savings recommendation |
| POST | `/api/credit-score/analyze` | Analyze credit score |
| GET | `/api/credit-score/history/{user_id}` | Credit score history |

## Product Modules

### 1. Loan Risk Prediction
- Input: age, income, employment length, home ownership, loan amount, intent, credit history, previous default
- ML model: GradientBoosting on Credit Risk Dataset
- Output: approval probability, default probability, risk label (Low/Medium/High), risk factors

### 2. Land Collateral Assessment
- Input: state, district, area, property type, requested loan
- Calculation: market value = area × rate_per_sqft, LTV ratio, max eligible loan (70% of value)
- Property rates seeded from NHB Residex estimates
- Works even without ML model (calculation-based)

### 3. Monthly Expenditure Tracker
- Real user-entered income and expenses by category
- 11 categories: Rent, Food, Transport, EMI, Utilities, Healthcare, Education, Entertainment, Shopping, Investment, Other
- Output: total expenses, disposable income, savings rate, category breakdown, pie chart

### 4. Savings & Investment Planner
- Uses income, expenses, risk profile (conservative/moderate/aggressive)
- Output: emergency fund target, suggested savings amount, investment split
- Rule-based + data-informed recommendations
- Includes disclaimer: "Educational estimate, not financial advice."

### 5. Credit Score Improvement
- ML model: GradientBoosting on Credit Score Classification Dataset
- Input: delayed payments, outstanding debt, utilization, EMI, history age, balance, loans/cards
- Output: predicted score class, improvement suggestions, 3-month action plan

## Database Schema

9 tables: `users`, `loan_predictions`, `collateral_assessments`, `property_rates`, `monthly_income`, `expenses`, `savings_plans`, `credit_score_assessments`, `model_versions`

## License

MIT
