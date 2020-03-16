import os
import numpy as np 
import pandas as pd 
import matplotlib.pyplot as plt
import seaborn as sns 
import base64
from pymongo import MongoClient
# from sklearn.experimental import enable_iterative_imputer
# from sklearn.impute import IterativeImputer

def db_connection():
    client = MongoClient("mongodb://127.0.0.1:27017")
    db = client["test"]   #Select the database 
    return db

def insert_plot(image,db):
    with open(image, "rb") as image_file:
        encoded_string = base64.b64encode(image_file.read())
    print(encoded_string)
    db.plots.insert({"image":encoded_string,"name":image})
    return "inserted"

def main(filename):
    
    my_path = os.path.abspath(os.getcwd()) 

    db=db_connection()
    col = db[filename]  #Select the collection
    df = pd.DataFrame(list(col.find()))
    df=df.drop(["_id"],axis=1)
    cols=df.columns.tolist()
    # for col in df.columns:
    #     if(df[col].dtype=='O'):
    #         df[col] = df[col].astype('category')
    #         df[col]=df[col].cat.codes
    # nan_sum = df.isna().sum()
    # if nan_sum.sum() > 0:
    #     imp = IterativeImputer(max_iter=10, random_state=0)
    #     df_imp=imp.fit(df)
    #     df[:]=df_imp.transform(df)
    
    for col in df.columns:
        box_title='Box_plot_of_'+ str(col) + '.png'
        kde_title="Distribution_of_"+ str(col) + '.png'
        plt.title(kde_title)
        plt.figure()
        sns.kdeplot(np.log1p(df[col]), shade=True)
        plt.savefig(my_path + '/images/' + kde_title)
        # insert_plot(kde_title,db)
        if df[col].isna().sum()==0:
            fig1, ax1 = plt.subplots()
            # ax1.set_title(box_title)
            ax1.boxplot(df[col])
            plt.savefig(my_path + '/images/' + box_title)
            # insert_plot(box_title,db)
        else:
            print("No box plot due to NaN values")
        print(df[col].describe())
    return cols