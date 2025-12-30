import os
import joblib as jb
import pandas as pd  
from dotenv import load_dotenv
from sklearn.tree import DecisionTreeClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, confusion_matrix,accuracy_score

load_dotenv()

datapath = os.getenv("DATA_PATH")
if datapath is None:
    raise ValueError("Data not found in datapath!")

data = pd.read_csv(datapath)

x = data.drop(columns = ['loan_status'])
y = data['loan_status']

x_train, x_test, y_train, y_test = train_test_split(x,y, random_state=42, test_size=0.2, stratify=y)  #Stratify balances the classification while distribution of train and test data

model = DecisionTreeClassifier(criterion='gini', max_depth=10, random_state=42)  #Gini is an impurity that splits the nodes/leaves of the tree

model.fit(x_train, y_train)

y_pred = model.predict(x_test)

acc = accuracy_score(y_test, y_pred)
print(f'Accuracy: {acc}')

cm = confusion_matrix(y_test,y_pred)
print(f'Confusion Mtrix: {cm}')

cr = classification_report(y_test, y_pred)
print(f'Classificatio Report: {cr}')


jb.dump(model, '../model/decision.pkl')