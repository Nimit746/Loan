import os
import numpy as np 
import joblib as jb
import pandas as pd
import seaborn as sns  
import matplotlib.pyplot as plt    
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.metrics import r2_score, mean_squared_error , root_mean_squared_error 
from dotenv import load_dotenv

load_dotenv()
DATA_PATH =  os.getenv("DATA_PATH")
if DATA_PATH is None:
    raise ValueError("Data Path is not found in .env file")
data = pd.read_csv(DATA_PATH)
X = data.drop(columns=['loan_status'])
y= data['loan_status']
X_train, X_test, y_train, y_test = train_test_split(
    X, y,
    test_size=0.2,
    random_state=42
)
model = LinearRegression()
model.fit(X_train, y_train)
y_pred = model.predict(X_test)
mse = mean_squared_error(y_test, y_pred)
rmse = np.sqrt(mse)
r2 = r2_score(y_test, y_pred)

print("Linear Regression Results")
print("---------------------------")
print("MSE :", mse)
print("RMSE:", rmse)
print("R²  :", r2)
jb.dump(model, r"C:\Users\sanje\OneDrive\Desktop\Loan\server\model\linear_model.pkl")
print("✅ Linear model saved successfully at: C:/Users/sanje/OneDrive/Desktop/Loan/server/model/linear_model.pkl")
