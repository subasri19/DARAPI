import React, { Component } from 'react';
  import { BrowserRouter as Router, Route } from 'react-router-dom'

  import NavBar from './components/NavBar'
  import Landing from './components/Landing'
  import Login from './components/Login'
  import Register from './components/Register'
  import Profile from './components/Profile'
  import FileUpload from './components/FileUpload';
  import UserFeatureInput from './components/UserFeatureInput'
  import SelectTarget from './components/SelectTarget';
  import FeatureDisplay from './components/FeatureDisplay'
  import DataVisualization from './components/DataVisualization'
  import OutlierAnalysis from './components/OutlierAnalysis';
  import MLResult from './components/MLResult';
  import Predictor from './components/Predictor';

  class App extends Component {
    constructor(){
      super();
      this.state = {
        filename:'',
        specs:[],
        percent:[],
        score:[],
        inputType:[],
        files:[],
        Linear_SVM:[],
        RandomForest1:[],
        DecisionTree:[],
        Adaptive_GB:[],
        Linear_Regression:[],
        RandomForest2:[],
        GradientBoosting:[],
      };
    }

    getFilename(name) {
      this.setState({
        filename: name
      })
      console.log("getFilename app.js")
    }

    getSpecs(specs) {
      this.setState({
        specs: specs
      })
      console.log("getSpecs app.js")
    }

    getInputType(inputType) {
      this.setState({
        inputType: inputType
      })
      console.log("getInputType app.js")
    }

    getPercent(percent) {
      this.setState({
        percent: percent
      })
      console.log("getPercent app.js")
    }

    getScore(score) {
      this.setState({
        score: score
      })
      console.log("getScore app.js")
    }

    getTarget(target) {
      this.setState({
        target: target
      })
      console.log("getTarget app.js")
    }

    getOutlier(out_opt) {
      this.setState({
        out_opt: out_opt
      })
      console.log("getOutlier app.js")
    }

    getfiles(files) {
      this.setState({
        files: files
      })
      console.log("getfiles app.js")
    }

    getLinear_SVM(Linear_SVM) {
      this.setState({
        Linear_SVM: Linear_SVM
      })
      console.log("getLinear_SVM app.js")
    }

    getRandomForest1(RandomForest1) {
      this.setState({
        RandomForest1: RandomForest1
      })
      console.log("getRandomForest1 app.js")
    }

    getDecisionTree(DecisionTree) {
      this.setState({
        DecisionTree: DecisionTree
      })
      console.log("getDecisionTree app.js")
    }

    getAdaptive_GB(Adaptive_GB) {
      this.setState({
        Adaptive_GB: Adaptive_GB
      })
      console.log("getAdaptive_GB app.js")
    }

    getLinear_Regression(Linear_Regression) {
      this.setState({
        Linear_Regression: Linear_Regression
      })
      console.log("getLinear_Regression app.js")
    }

    getRandomForest2(RandomForest2) {
      this.setState({
        RandomForest2: RandomForest2
      })
      console.log("getRandomForest2 app.js")
    }

    getGradientBoosting(GradientBoosting) {
      this.setState({
        GradientBoosting: GradientBoosting
      })
      console.log("getGradientBoosting app.js")
    }

    getCall(Call){
      this.setState({
        Call:Call
      })
      console.log("getCall app.js")
    }

    getKeys(keys) {
      this.setState({
        keys: keys
      })
      console.log("getKeys app.js")
    }

    render () {
      return (
        <Router>
          <div className="App">
            <NavBar />
            <Route exact path="/" component={Landing} />
            <div className="container">
              <Route exact path="/register" component={Register} />
              <Route exact path="/login" component={Login} />
              <Route exact path="/profile" component={Profile} />
              <Route exact path="/upload" 
                component={() => 
                  <FileUpload filename={ this.getFilename.bind(this)}
                  />
                } 
              />
              <Route exact path="/input" component={() => 
                  <UserFeatureInput filename={ this.state.filename }
                    specs={ this.getSpecs.bind(this) }
                    inputType={ this.getInputType.bind(this) }
                  />
              }/>
              <Route exact path="/visualize" 
                component={() => 
                  <DataVisualization filename={this.state.filename}
                    specs={ this.state.specs }
                  />
                } 
              />
              <Route exact path="/outliers" 
                component={() => 
                  <OutlierAnalysis out_opt={this.getOutlier.bind(this)}
                    filename={ this.state.filename }
                  />
                }
              />
              <Route exact path="/target"  
                component={() => 
                  <SelectTarget filename={ this.state.filename }
                    inputType={ this.state.inputType } 
                    specs={ this.getSpecs.bind(this) } 
                    percent={ this.getPercent.bind(this) } 
                    score={ this.getScore.bind(this) } 
                    target={ this.getTarget.bind(this)}
                  /> 
                } 
              />
              <Route exact path='/features'
                component={() => 
                  <FeatureDisplay specs={ this.state.specs }
                    score={ this.state.score }
                    percent={ this.state.percent }
                    filename={ this.state.filename }
                    target={this.state.target}
                    files={ this.getfiles.bind(this) }
                    Linear_SVM={ this.getLinear_SVM.bind(this) }
                    RandomForest1={ this.getRandomForest1.bind(this) }
                    DecisionTree={ this.getDecisionTree.bind(this) }
                    Adaptive_GB={ this.getAdaptive_GB.bind(this) }
                    Linear_Regression={ this.getLinear_Regression.bind(this) }
                    RandomForest2={ this.getRandomForest2.bind(this) }
                    GradientBoosting={ this.getGradientBoosting.bind(this) }
                    Call={ this.getCall.bind(this) }
                    inputType = {this.state.inputType}
                    keys={ this.getKeys.bind(this) }
                  />
                }
              />
              <Route exact path='/result'
                component={() =>
                <MLResult files={ this.state.files }
                  Linear_SVM={ this.state.Linear_SVM }
                  RandomForest1={ this.state.RandomForest1 }
                  DecisionTree={ this.state.DecisionTree }
                  Adaptive_GB={ this.state.Adaptive_GB }
                  Linear_Regression={ this.state.Linear_Regression }
                  RandomForest2={ this.state.RandomForest2 }
                  GradientBoosting={ this.state.GradientBoosting }
                  Call={ this.state.Call }
                />
              }
            />
            <Route exact path='/predict' 
                component={() => 
                  <Predictor keys = {this.state.keys}
                  files={ this.state.files }
                  Linear_SVM={ this.state.Linear_SVM }
                  RandomForest1={ this.state.RandomForest1 }
                  DecisionTree={ this.state.DecisionTree }
                  Adaptive_GB={ this.state.Adaptive_GB }
                  Linear_Regression={ this.state.Linear_Regression }
                  RandomForest2={ this.state.RandomForest2 }
                  GradientBoosting={ this.state.GradientBoosting }
                  Call={ this.state.Call }
                  target={this.state.target}
                  inputType = {this.state.inputType}
                  />
                } 
              />
            </div>
          </div>
        </Router>
      );
    }
  }

  export default App;