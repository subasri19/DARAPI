import pandas as pd
from sklearn.ensemble import IsolationForest
import numpy as np
from pymongo import MongoClient

outlier_cols = []
frames = []
c1=pd.DataFrame()
outlier_info = pd.DataFrame()


def main(collection):
    client = MongoClient("mongodb://127.0.0.1:27017") #host uri  
    db = client["test"]   #Select the database  
    col = db[collection]  #Select the collection
    
    data = pd.DataFrame(list(col.find()))
    data.drop(data.columns[[0]], axis = 1, inplace = True) 
    df=data
    features = df.columns 
    outlier_info = pd.DataFrame(columns = features)
    outlier_cols = []
    frames = []
    c1=pd.DataFrame()

    for col in features:
        q1=df[col].quantile(0.25)
        q3=df[col].quantile(0.75)
        if ((q1!=q3)&(q1<q3)):
            iqr = q3-q1
            outlier_df=df[(df[col]<(q1-(1.5*iqr))) | (df[col]>(q3+(1.5*iqr)))]
            if outlier_df[col].count()>0:
                outlier_cols.append(col)
                outlier_info.at[col]=outlier_df[col].count()
    return outlier_cols
