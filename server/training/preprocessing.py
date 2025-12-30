import os
import numpy as np
import pandas as pd
import joblib as jb
import seaborn as sns
import matplotlib.pyplot as plt
from sklearn.preprocessing import LabelEncoder

os.system('cls')
data = pd.read_csv("../dataset/loan_approval_dataset.csv")

print('This is the information about the dataset: ')
print(data.info())
print('This is the description of the dataset: ')
print(data.describe())
print('This is the number of null values in the dataset: ')
print(data.isnull().sum())
print('These are the columns in the dataset: ')
print(data.columns)
print('This is the shape of the dataset: ')
print(data.shape)
print('This is the size of the dataset: ')
print(data.size)
print('These are the first 5 rows of the dataset: ')
print(data.head())
print()






data = data.drop(columns=['loan_id', 'no_of_dependents', 'education', 'self_employed'])

for col in data.select_dtypes(include="object"):
    data[col] = LabelEncoder().fit_transform(data[col])
correlation_matrix = data.corr()
plt.figure(figsize=(10,8))
sns.heatmap(correlation_matrix, annot=True, cmap='coolwarm', center=0)
plt.title('Correlation Heatmap')
plt.tight_layout()
plt.show()
data['dti_ratio'] = data['loan_amount'] / data['income_annum']
data['total_assets'] = data['residential_assets_value'] + data['commercial_assets_value'] + data['luxury_assets_value'] + data['bank_asset_value']
data['asset_coverage'] = data['total_assets'] / data['loan_amount']
data['affordability_index'] = data['income_annum'] / (data['loan_amount']/data['loan_term'])
data.to_csv("../dataset/prepro.csv", index=False)