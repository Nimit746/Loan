import os
import pandas as pd
import joblib as jb
from dotenv import load_dotenv
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix

# -------- Load environment variables --------
load_dotenv()
DATA_PATH = os.getenv("DATA_PATH")

if DATA_PATH is None:
    raise ValueError("DATA_PATH not found in .env file")

# -------- Load processed dataset --------
data = pd.read_csv(DATA_PATH)

# -------- Separate features and target --------
X = data.drop(columns=['loan_status'])
y = data['loan_status']

# -------- Train-test split --------
X_train, X_test, y_train, y_test = train_test_split(
    X, y,
    test_size=0.2,
    random_state=42,
    stratify=y
)

# -------- Train Random Forest model --------
model = RandomForestClassifier(
    n_estimators=200,
    max_depth=10,
    random_state=42,
    n_jobs=-1
)

model.fit(X_train, y_train)

# -------- Predictions --------
y_pred = model.predict(X_test)

# -------- Evaluation --------
accuracy = accuracy_score(y_test, y_pred)

print("✅ Random Forest Results")
print("------------------------")
print("Accuracy:", accuracy)
print("\nConfusion Matrix:\n", confusion_matrix(y_test, y_pred))
print("\nClassification Report:\n", classification_report(y_test, y_pred))

# -------- Save model --------
MODEL_PATH = r"C:\Users\sanje\OneDrive\Desktop\Loan\server\model\random_forest.pkl"
jb.dump(model, MODEL_PATH)

print(f"\n✅ Random Forest model saved at: {MODEL_PATH}")
