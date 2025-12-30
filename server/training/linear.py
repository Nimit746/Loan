import os
import numpy as np 
import joblib as jb
import pandas as pd
import seaborn as sns  
from dotenv import load_dotenv
import matplotlib.pyplot as plt    
from sklearn.linear_model import LinearRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import r2_score, mean_squared_error, root_mean_squared_error

load_dotenv()

datapath = os.getenv("DATA_PATH")
if datapath is None:
    raise ValueError("Data not found in datapath!")

data = pd.read_csv(datapath)

x = data.drop(columns = ['loan_status'])
y = data['loan_status']

x_train, x_test, y_train, y_test = train_test_split(x,y, random_state=42, test_size=0.2)
model = LinearRegression()

model.fit(x_train, y_train)

y_pred = model.predict(x_test)

mse = mean_squared_error(y_test,y_pred)
rmse = np.sqrt(mse)
r2 = r2_score(y_test, y_pred)

print(f'The Mean Squared Error is {mse}')
print(f'The Root Mean Squared Error is {rmse}')
print(f'The R2 Square is {r2}')

jb.dump(model,'../model/linear.pkl')
print(f'The model has been save to {datapath}')
