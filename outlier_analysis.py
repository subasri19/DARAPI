import pandas as pd
from sklearn.ensemble import IsolationForest
import numpy as np
from pymongo import MongoClient

def main(collection,choice):
    client = MongoClient("mongodb://127.0.0.1:27017") #host uri  
    db = client["test"]   #Select the database  
    col = db[collection]  #Select the collection
    client.drop_database("datasets")
    datasets = client["datasets"]
    data = pd.DataFrame(list(col.find()))
    data.drop(data.columns[[0]], axis = 1, inplace = True) 
    df=data
    features = df.columns 
    outlier_info = pd.DataFrame(columns = features)
    outlier_cols = []
    frames = []
    
    for col in features:
        q1=df[col].quantile(0.25)
        q3=df[col].quantile(0.75)
        if ((q1!=q3)&(q1<q3)):
            iqr = q3-q1
            outlier_df=df[(df[col]<(q1-(1.5*iqr))) | (df[col]>(q3+(1.5*iqr)))]
            if outlier_df[col].count()>0:
                outlier_cols.append(col)
                outlier_info.at[col]=outlier_df[col].count()
                frames.append(outlier_df)

    #print(frames)
    iqr_outliers=pd.concat(frames).drop_duplicates(keep=False)

    iso_forest = IsolationForest(n_estimators=500)
    iforest = iso_forest.fit(df)
    isof=iforest.predict(df)


    isoF_outliers_values = df[np.where(isof == -1, True, False)]

    common = iqr_outliers.merge(isoF_outliers_values,how='inner')
        
    if choice==1:
        final=df
    
    elif choice==2:
        df1=pd.concat([df, common]).drop_duplicates(keep=False)
        for i in outlier_cols:
            common[i]=df1[i].mean()
        frames=[df1,common]
        result=pd.concat(frames)
        final=result
    
    elif choice==3:
        df1=pd.concat([df, common]).drop_duplicates(keep=False)
        for col in outlier_cols:
            q1=df[col].quantile(0.25)
            q3=df[col].quantile(0.75)
            for i in range(len(common)) : 
                if(common.loc[i, col]<=q1):
                    common.loc[i, col]=q1
                elif(common.loc[i, col]>=q3):
                    common.loc[i, col]=q3
        frames=[df1,common]
        result=pd.concat(frames)
        final=result
            
    elif choice==4:
        df1=pd.concat([df, common]).drop_duplicates(keep=False)
        final=df1

    
    name="dataset_outlier_"+str(choice)+".csv"
    result_new = datasets[name]
    result_new.drop()
    new_collection = datasets[name]
    mdata = final.to_dict("records")
    new_collection.insert_many(mdata)
    return "Successful"








