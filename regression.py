import pandas as pd
from sklearn.model_selection import train_test_split
from pymongo import MongoClient
from sklearn import datasets, linear_model, metrics 
from sklearn.ensemble import RandomForestRegressor
from sklearn import ensemble
from sklearn.preprocessing import StandardScaler
from sklearn.decomposition import PCA
import numpy as np

       
def main(collection,imp_features,target,inputType):
    client = MongoClient("mongodb://127.0.0.1:27017") #host uri  
    db = client["datasets"]
    col_names = db.collection_names()
    column_names =['Linear_Regression','RandomForest','GradientBoosting']
    result = pd.DataFrame(columns=column_names)
    result['datasets']=col_names
    result.set_index('datasets')
    result=result[0:0]
    result=result.drop(['datasets'],axis=1)

    for i in col_names:
        col = db[i]
        data = pd.DataFrame(list(col.find()))
        data.drop(data.columns[[0]], axis = 1, inplace = True) 
        df=data
        df=df[imp_features]
        cat_features=[]

        for key in imp_features:
            if(inputType[key]=="1"):
                cat_features.append(key)


        df = pd.get_dummies(df, columns=cat_features, drop_first=True)

        sc= StandardScaler()
        pca = PCA()
    
        X = pd.DataFrame()
        y = pd.DataFrame()
 
        X = df
        print(X.columns)

        y[target] = data[target]

        y =  np.log1p(y)
        for col in X.columns:
            if np.abs(X[col].skew()) > 0.3:
                X[col] = np.log1p(X[col])

        X_train, X_test, y_train, y_test = train_test_split(X, y,test_size=0.1, random_state = 0)

        #Applying StandardScaler on it
        X_train = sc.fit_transform(X_train)
        X_test = sc.transform(X_test)

        #Applying PCA on it
        X_train = pca.fit_transform(X_train)
        X_test = pca.transform(X_test)
    
        #Linear Regression
        print("Linear regression")
        reg = linear_model.LinearRegression() 
        reg.fit(X_train, y_train) 
        print("Test set score: {:.2f}".format(reg.score(X_test, y_test)))
        result.at[i,'Linear_Regression']=round(reg.score(X_test, y_test),2)
    
        #RandomForest Regressor
        print("RandomForest Classifier")
        regressor = RandomForestRegressor(n_estimators = 20, random_state = 0)
        regressor.fit(X_train,y_train)
        print("Test set score: {:.2f}".format(regressor.score(X_test, y_test)))
        result.at[i,'RandomForest']=round(regressor.score(X_test, y_test),2)
    
        #Gradient Boosting Regression
        print("Gradient Boosting Regressor")
        params = {'n_estimators': 500, 'max_depth': 4, 'min_samples_split': 2,'learning_rate': 0.01, 'loss': 'ls'}
        model = ensemble.GradientBoostingRegressor(**params)
        model.fit(X_train,y_train)
        print("Test set score: {:.2f}".format(model.score(X_test, y_test)))
        result.at[i,'GradientBoosting']=round(model.score(X_test, y_test),2)
    
    return result








