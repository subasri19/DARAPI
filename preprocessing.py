import pandas as pd
from sklearn.experimental import enable_iterative_imputer
from sklearn.impute import IterativeImputer
from pymongo import MongoClient
from sklearn.preprocessing import LabelEncoder

def main(collection):
    client = MongoClient("mongodb://127.0.0.1:27017") #host uri  
    db = client["test"]   #Select the database  
    col = db[collection]  #Select the collection
    data = pd.DataFrame(list(col.find()))
    data.drop(data.columns[[0]], axis = 1, inplace = True) 
    df=data

    #Handling missing data
    nan_sum = df.isna().sum()

    if nan_sum.sum() > 0:
        imp = IterativeImputer(max_iter=10, random_state=0)
        df_imp=imp.fit(df)
        df[:]=df_imp.transform(df)

    #Convert the categorical data into labels
    from sklearn.preprocessing import LabelEncoder
    labelencoder_Y = LabelEncoder()
    for i in df.columns:
        if (df[i].dtype == 'O'):
            df[i] = labelencoder_Y.fit_transform(df[i])

    return df
    