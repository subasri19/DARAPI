from flask import Flask, jsonify, request, json 
from flask_pymongo import PyMongo 
from bson.objectid import ObjectId 
from datetime import datetime 
from flask_bcrypt import Bcrypt 
from flask_cors import CORS
from flask_jwt_extended import JWTManager 
from flask_jwt_extended import create_access_token
from pymongo import MongoClient
import os
import pandas as pd

import feature_selection
import data_visualization
import outlier_analysis
import get_outlier_columns
import classification
import regression
# import preprocessing
import prediction


app = Flask(__name__)

app.config['MONGO_DBNAME'] = 'reactloginreg'
app.config['MONGO_URI'] = 'mongodb://localhost:27017/test'
app.config['JWT_SECRET_KEY'] = 'secret'


client = MongoClient("mongodb://127.0.0.1:27017") #host uri  
db = client["test"]   #Select the database

mongo = PyMongo(app)
bcrypt = Bcrypt(app)
jwt = JWTManager(app)

CORS(app)

@app.route('/users/register', methods=["POST"])
def register():
    users = mongo.db.users 
    first_name = request.get_json()['first_name']
    last_name = request.get_json()['last_name']
    email = request.get_json()['email']
    password = bcrypt.generate_password_hash(request.get_json()['password']).decode('utf-8')
    created = datetime.utcnow()

    user_id = users.insert({
        'first_name': first_name,
        'last_name': last_name,
        'email': email,
        'password': password,
        'created': created 
    })

    new_user = users.find_one({'_id': user_id})

    result = {'email': new_user['email'] + ' registered'}

    return jsonify({'result' : result})

@app.route('/users/login', methods=['POST'])
def login():
    users = mongo.db.users 
    email = request.get_json()['email']
    password = request.get_json()['password']
    result = ""

    response = users.find_one({'email': email})

    if response:
        if bcrypt.check_password_hash(response['password'], password):
            access_token = create_access_token(identity = {
                'first_name': response['first_name'],
                'last_name': response['last_name'],
                'email': response['email']
            })
            result = jsonify({'token':access_token})
        else:
            result = jsonify({"error":"Invalid username and password"})
    else:
        result = jsonify({"result":"No results found"})
    return result 

@app.route('/users/store_to_db', methods=["POST"])
def storeInDb():
    request_file = request.files['data_file']
    if not request_file:
        return "No file"
    df = pd.read_csv(request_file) #csv file which you want to import
    records_ = df.to_dict(orient = 'records')
    result = db[request_file.filename]
    result.drop()
    result = db[request_file.filename].insert_many(records_ )
    filename = request_file.filename
    # Preprocessing
    # df_new = preprocessing.main(filename)
    # records_new = df_new.to_dict(orient = 'records')
    # result_new = db[filename]
    # result_new.drop()
    # result_new = db[filename].insert_many(records_new)
    return jsonify({"result":"File sucessfully uploaded!","filename":filename})

@app.route('/users/load_features',methods=["POST"])
def loadFeatures():
    collection=request.get_json()['collection']
    col = db[collection]  #Select the collection
    df = pd.DataFrame(list(col.find()))
    df = df.drop(["_id"],axis=1)
    cols = df.columns.tolist()
    return jsonify({"specs":cols})

@app.route('/users/feature_input',methods=["POST"])
def featureInput():
    feature_type=request.get_json()['feature_type']
    col = db['feature_input'].insert_one(feature_type)  #Select the collection
    return "none"

@app.route('/users/target', methods=["POST"])
def selecttarget():
    db = client['test']
    col_name=request.get_json()['collection']
    col = db[col_name]
    df = pd.DataFrame(list(col.find()))
    cols=df.columns.tolist()
    return jsonify({"result":cols})

@app.route('/users/features', methods=["POST"])
def impfeatures():
    collection=request.get_json()['collection']
    target=request.get_json()['target']
    inputType=request.get_json()['inputType']
    result=feature_selection.main(collection,target,inputType)
    print(result)
    return jsonify({"collection":collection,"target":target,"res_specs":result['Specs'].tolist(),"res_score":result['Score'].tolist(),"res_percent":result['Percent'].tolist()})

@app.route('/users/visualize', methods=["POST"])
def storePlots():
    collection=request.get_json()['collection']
    result=data_visualization.main(collection)
    return jsonify({"specs":result})


@app.route('/users/getoutliercols', methods=["POST"])
def outlierCols():
    collection=request.get_json()['collection']
    result=get_outlier_columns.main(collection)
    return jsonify({"outliercols":result})
    # return jsonify({"option":option})

@app.route('/users/outliers', methods=["POST"])
def outliers():
    collection=request.get_json()['collection']
    option=request.get_json()['option']
    result=outlier_analysis.main(collection,option)
    return jsonify({"result":result})
    # return jsonify({"option":option})

@app.route('/users/classify', methods=["POST"])
def predict_classify():
    collection=request.get_json()['collection']
    features=request.get_json()['features']
    target=request.get_json()['target']
    inputType=request.get_json()['inputType']
    ml_result=classification.main(collection,features,target,inputType)
    return jsonify({"Linear_SVM":ml_result['Linear_SVM'].tolist(),"RandomForest":ml_result['RandomForest'].tolist(),"DecisionTree":ml_result['DecisionTree'].tolist(),"Adaptive_GB":ml_result['Adaptive_GB'].tolist(),"files":ml_result.index.tolist()})

@app.route('/users/regression', methods=["POST"])
def predict_regression():
    collection=request.get_json()['collection']
    features=request.get_json()['features']
    target=request.get_json()['target']
    inputType=request.get_json()['inputType']
    ml_result=regression.main(collection,features,target,inputType)
    return jsonify({"Linear_Regression":ml_result['Linear_Regression'].tolist(),"RandomForest":ml_result['RandomForest'].tolist(),"GradientBoosting":ml_result['GradientBoosting'].tolist(),"files":ml_result.index.tolist()})

@app.route('/users/final_prediction', methods=["POST"])
def final_predict():
    file_name=request.get_json()['file_name']
    algorithm_name=request.get_json()['algorithm_name']
    pred_type=request.get_json()['pred_type']
    features=request.get_json()['features']
    target=request.get_json()['target']
    inputType=request.get_json()['inputType']
    feature_values=request.get_json()['feature_values']
    result=prediction.main(file_name,algorithm_name,pred_type,features,target,inputType,feature_values)
    return jsonify({"result":result.tolist()})


if __name__ == '__main__':
    app.run(debug=True)  