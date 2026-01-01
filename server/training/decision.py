import os
import numpy as np 
import joblib as jb
import pandas as pd
import seaborn as sns  
import matplotlib.pyplot as plt    
from sklearn.datasets import load_iris
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error, r2_score, accuracy_score, confusion_matrix, classification_report
from sklearn.tree import DecisionTreeClassifier, plot_tree
from dotenv import load_dotenv

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
# -------- Train Decision Tree model --------
model = DecisionTreeClassifier(
    criterion="gini",
    max_depth=6,
    random_state=42
)

model.fit(X_train, y_train)

y_pred = model.predict(X_test)

# -------- Evaluation --------
accuracy = accuracy_score(y_test, y_pred)

print("✅ Decision Tree Results")
print("------------------------")
print("Accuracy:", accuracy)
print("\nConfusion Matrix:\n", confusion_matrix(y_test, y_pred))
print("\nClassification Report:\n", classification_report(y_test, y_pred))

# -------- Save model --------
MODEL_PATH = r"C:\Users\sanje\OneDrive\Desktop\Loan\server\model\decision_tree.pkl"
jb.dump(model, MODEL_PATH)

print(f"\n✅ Decision Tree model saved at: {MODEL_PATH}")