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

       
def main(collection,imp_features,target,inputType):
    client = MongoClient("mongodb://127.0.0.1:27017") #host uri  
    db = client["datasets"]
    col_names = db.collection_names()
    column_names =['Linear_SVM','RandomForest','DecisionTree','Adaptive_GB']
    result = pd.DataFrame(columns=column_names)
    result['datasets']=col_names
    result.set_index('datasets')
    result=result[0:0]
    result=result.drop(['datasets'],axis=1)

    for i in col_names:
        print(i)
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

        X_train, X_test, y_train, y_test = train_test_split(X, y,test_size=0.1, random_state = 0)

        #Applying StandardScaler on it
        X_train = sc.fit_transform(X_train)
        X_test = sc.transform(X_test)

        #Applying PCA on it
        X_train = pca.fit_transform(X_train)
        X_test = pca.transform(X_test)
        
        #Linear Support Vector Classifier
        print("Linear Support Vector Classifier")
        svc = LinearSVC(max_iter= 1000, C = 70)
        svc.fit(X_train,y_train)
        print("Test set score: {:.2f}".format(svc.score(X_test, y_test)))
        result.at[i,'Linear_SVM']=round(svc.score(X_test, y_test), 2)
        
        #RandomForest Classifier
        print("RandomForest Classifier")
        rf = RandomForestClassifier(n_estimators= 20, criterion = 'entropy', random_state = 0)
        rf.fit(X_train,y_train)
        print("Test set score: {:.2f}".format(rf.score(X_test, y_test)))
        result.at[i,'RandomForest']=round(rf.score(X_test, y_test),2)
        
        #DecisionTree Classifier
        print("DecisionTree Classifier")
        clf_gini = DecisionTreeClassifier(criterion = "gini", random_state = 100,max_depth=3, min_samples_leaf=5) 
        clf_gini.fit(X_train, y_train) 
        print("Test set score: {:.2f}".format(clf_gini.score(X_test, y_test)))
        result.at[i,'DecisionTree']=round(clf_gini.score(X_test, y_test),2)
        
        #Adaptive Gradient Boosting Classifier
        print("Adaptive Gradient Boosting Classifier")
        abc = AdaBoostClassifier(n_estimators=50,learning_rate=1)
        model = abc.fit(X_train, y_train)
        print("Test set score: {:.2f}".format(model.score(X_test, y_test)))
        result.at[i,'Adaptive_GB']=round(model.score(X_test, y_test),2)

    print(result)
    return result





    








