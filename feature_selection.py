import pandas as pd
from sklearn.feature_selection import SelectKBest
from sklearn.feature_selection import chi2
from sklearn.feature_selection import f_regression
from pymongo import MongoClient

def find_categorical(df, inputType):
    likely_cat = {}
    for var in df.columns:
        if(inputType[var]=="1"):
            likely_cat[var]=True
        else:
            likely_cat[var]=False
    return likely_cat

def assign_coltype(likely_cat):
    res1 = all(value == True for value in likely_cat.values())
    res2 = all(value == False for value in likely_cat.values())
    
    if res1==True:
        return 1
    elif res2==True:
        return 0
    else:
        return -1

def feature_selection_model(model_name,X,y):
    #apply SelectKBest class to extract top 10 best features
    bestfeatures = SelectKBest(score_func=model_name,k='all')
    fit = bestfeatures.fit(X,y)
    dfscores = pd.DataFrame(fit.scores_)
    dfcolumns = pd.DataFrame(X.columns)
    #concat two dataframes for better visualization 
    featureScores = pd.concat([dfcolumns,dfscores],axis=1)
    featureScores.columns = ['Specs','Score']  #naming the dataframe columns
    score_sum = featureScores['Score'].sum()
    featureScores['Percent'] = (featureScores['Score']*100)/score_sum
    return featureScores
    
def pearson(df,col):
    cor = df.corr()
    #Correlation with output variable
    cor_target = abs(cor[col])
    featureScores = cor_target.to_frame().reset_index()
    featureScores = featureScores.rename(columns = {"index": "Specs", col:"Score"})
    featureScores = featureScores[featureScores.Specs != col]
    score_sum = featureScores['Score'].sum()
    featureScores['Percent'] = (featureScores['Score']*100)/score_sum
    return featureScores

def main(collection, target, inputType):
    client = MongoClient("mongodb://127.0.0.1:27017") #host uri  
    db = client["test"]   #Select the database  
    col = db[collection]  #Select the collection
    data = pd.DataFrame(list(col.find()))
    
    X = pd.DataFrame()
    y = pd.DataFrame()
    type_of_problem = None
    catcols = pd.DataFrame()
    numcols = pd.DataFrame()
    features = pd.DataFrame()

    data.drop(data.columns[[0]], axis = 1, inplace = True) 
    X = data #independent columns
    X=X.drop([target], axis = 1) 
    y['target'] = data[target]

    
    likely_cat1 = find_categorical(X, inputType)

    likely_cat={}
    if(inputType[target]=="1"):
        likely_cat[target]=True
    else:
        likely_cat[target]=False

    likely_cat2 = likely_cat
    coltype1 = assign_coltype(likely_cat1)
    coltype2 = assign_coltype(likely_cat2)

    if (coltype1==1) & (coltype2==1):
        features=feature_selection_model(chi2,X,y)
        type_of_problem = 'classification'
    elif (coltype1==1) & (coltype2==0):
        features=feature_selection_model(f_regression,X,y)
        type_of_problem = 'regression'
    elif (coltype1==0) & (coltype2==1):
        features=feature_selection_model(f_regression,X,y)
        type_of_problem = 'classification'
    elif (coltype1==0) & (coltype2==0):
        features=pearson(data,target)
        type_of_problem = 'regression'
    elif (coltype1==-1):
        for key,value in likely_cat1.items():
            if value==True:
                catcols = pd.concat([catcols,data[key]], axis = 1)
            else:
                numcols = pd.concat([numcols,data[key]], axis = 1)
        if (coltype2==1):
            f1=feature_selection_model(chi2,catcols,y)
            f2=feature_selection_model(f_regression,numcols,y)
            features=pd.concat([f1,f2],ignore_index=True)
            features.drop('Percent',axis=1)
            score_sum = features['Score'].sum()
            features['Percent'] = (features['Score']*100)/score_sum
            type_of_problem = 'classification'
        else:
            f1=feature_selection_model(f_regression,catcols,y)
            df2=data.drop(catcols,axis=1)
            f2=pearson(df2,target)
            features=pd.concat([f1,f2],ignore_index=True)
            features.drop('Percent',axis=1)
            score_sum = features['Score'].sum()
            features['Percent'] = (features['Score']*100)/score_sum
            type_of_problem = 'regression'
    # print(features.sort_values(by='Percent', ascending=False))
    result = features.sort_values(by='Percent', ascending=False)
    # print(type(result))
    return result