import pandas as pd
from sklearn.svm import LinearSVC
from sklearn.model_selection import train_test_split
from pymongo import MongoClient
from sklearn.ensemble import RandomForestClassifier
from sklearn.tree import DecisionTreeClassifier 
from sklearn.ensemble import AdaBoostClassifier
from sklearn.preprocessing import StandardScaler
from sklearn.decomposition import PCA
from sklearn.model_selection import RandomizedSearchCV
from sklearn import datasets, linear_model, metrics 
from sklearn.ensemble import RandomForestRegressor
from sklearn import ensemble
from sklearn.preprocessing import StandardScaler
from sklearn.decomposition import PCA
import numpy as np

       
def main(file_name,algorithm_name,pred_type,imp_features,target,inputType,feature_values):
    client = MongoClient("mongodb://127.0.0.1:27017") #host uri  
    db = client["datasets"]
    col = db[file_name]
    data = pd.DataFrame(list(col.find()))
    data.drop(data.columns[[0]], axis = 1, inplace = True) 
    df=data
    df=df[imp_features]
    cat_features=[]

    test=pd.DataFrame(columns=imp_features,index=[0])
    test.loc[0]=feature_values

    sc= StandardScaler()
    pca = PCA()
    
    X = pd.DataFrame()
    y = pd.DataFrame()
 
    X = df

    y[target] = data[target]

    X_train, X_test, y_train, y_test = train_test_split(X, y,test_size=0.1, random_state = 0)

    #Applying StandardScaler on it
    X_train = sc.fit_transform(X_train)
    X_test = sc.transform(X_test)

    #Applying PCA on it
    X_train = pca.fit_transform(X_train)
    X_test = pca.transform(X_test)

    y =  np.log1p(y)
    for col in X.columns:
        if np.abs(X[col].skew()) > 0.3:
            X[col] = np.log1p(X[col])

    if(algorithm_name=="Linear_SVM"):
        #Linear Support Vector Classifier
        print("Linear Support Vector Classifier")
        svc = LinearSVC(max_iter= 1000, C = 70)
        svc.fit(X_train,y_train)
        print("Test set score: {:.2f}".format(svc.score(X_test, y_test)))
        result=svc.predict(test)
        print(result)

    
    elif(algorithm_name=="RandomForest" and pred_type=="Classification"):   
        #RandomForest Classifier
        print("RandomForest Classifier")
        rf = RandomForestClassifier(n_estimators= 20, criterion = 'entropy', random_state = 0)
        rf.fit(X_train,y_train)
        print("Test set score: {:.2f}".format(rf.score(X_test, y_test)))
        result=rf.predict(test)
        print(result)

        
    elif(algorithm_name=="DecisionTree"):
        #DecisionTree Classifier
        print("DecisionTree Classifier")
        clf_gini = DecisionTreeClassifier(criterion = "gini", random_state = 100,max_depth=3, min_samples_leaf=5) 
        clf_gini.fit(X_train, y_train) 
        print("Test set score: {:.2f}".format(clf_gini.score(X_test, y_test)))
        result=clf_gini.predict(test)
        print(result)


    elif(algorithm_name=="Adaptive_GB"):
        #Adaptive Gradient Boosting Classifier
        print("Adaptive Gradient Boosting Classifier")
        abc = AdaBoostClassifier(n_estimators=50,learning_rate=1)
        model = abc.fit(X_train, y_train)
        print("Test set score: {:.2f}".format(model.score(X_test, y_test)))
        result=model.predict(test)
        print(result)


    elif(algorithm_name=="Linear_Regression"):   
        #Linear Regression
        print("Linear regression")
        reg = linear_model.LinearRegression() 
        reg.fit(X_train, y_train) 
        print("Test set score: {:.2f}".format(reg.score(X_test, y_test)))
        result=reg.predict(test)
        print(result)
       
    
    elif(algorithm_name=="RandomForest" and pred_type=="Regression"):
        #RandomForest Regressor
        print("RandomForest Classifier")
        regressor = RandomForestRegressor(n_estimators = 20, random_state = 0)
        regressor.fit(X_train,y_train)
        print("Test set score: {:.2f}".format(regressor.score(X_test, y_test)))
        result=regressor.predict(test)
        print(result)

    
    elif(algorithm_name=="GradientBoosting"):
        #Gradient Boosting Regression
        print("Gradient Boosting Regressor")
        params = {'n_estimators': 500, 'max_depth': 4, 'min_samples_split': 2,'learning_rate': 0.01, 'loss': 'ls'}
        model = ensemble.GradientBoostingRegressor(**params)
        model.fit(X_train,y_train)
        print("Test set score: {:.2f}".format(model.score(X_test, y_test)))
        result=model.predict(test)
        print(result)
        
    
    return result