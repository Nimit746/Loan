import os
import numpy as np 
import joblib as jb
import pandas as pd
import seaborn as sns  
import matplotlib.pyplot as plt    
from sklearn.datasets import load_iris
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error, r2_score
from sklearn.tree import DecisionTreeClassifier, plot_tree