import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import axios from 'axios'

class Predictor extends Component {
    constructor(props) {
        super(props)
        this.state = {
            keys: this.props.keys,
            files: this.props.files,
            Linear_SVM: this.props.Linear_SVM,
            RandomForest1:this.props.RandomForest1,
            DecisionTree:this.props.DecisionTree,
            Adaptive_GB:this.props.Adaptive_GB,
            Linear_Regression:this.props.Linear_Regression,
            RandomForest2:this.props.RandomForest2,
            GradientBoosting:this.props.GradientBoosting,
            Call:this.props.Call,
            target:this.props.target,
            inputType:this.props.inputType,
            imp_features:this.props.keys,
            feature_values:[],
            result:'',
            file_name:'',
            algorithm_name:''
        }
    }

    componentDidMount = () => {
        
        console.log(this.state.Call)
        let ind_arr = []
        let max_arr= []
        let f_name =''
        let a_name=''

        if(this.state.Call == "Classification")
        {
            let algos=['Linear_SVM','RandomForest','DecisionTree','Adaptive_GB']

            
            max_arr[0] = Math.max(...this.state.Linear_SVM)
            ind_arr[0] = this.state.Linear_SVM.indexOf(Math.max(...this.state.Linear_SVM));

            max_arr[1] = Math.max(...this.state.RandomForest1)
            ind_arr[1] = this.state.RandomForest1.indexOf(Math.max(...this.state.RandomForest1));

            max_arr[2] = Math.max(...this.state.DecisionTree)
            ind_arr[2] = this.state.DecisionTree.indexOf(Math.max(...this.state.DecisionTree));

            max_arr[3] = Math.max(...this.state.Adaptive_GB)
            ind_arr[3] = this.state.Adaptive_GB.indexOf(Math.max(...this.state.Adaptive_GB));

            let max_ind = max_arr.indexOf(Math.max(...max_arr));

            let file_index = ind_arr[max_ind]

            f_name=this.state.files[file_index]
            a_name= algos[max_ind]

            console.log(max_arr)
            console.log(ind_arr)
            console.log(max_ind)
            console.log(file_index)
            console.log(f_name)
            console.log(a_name)

            this.setState({
                file_name:f_name,
                algorithm_name:a_name
            })
            console.log(this.state.file_name)

        }

        else
        {
            let ind_arr = []
            let max_arr= []

            let algos=['Linear_Regression','RandomForest','GradientBoosting']

            max_arr[0] = Math.max(...this.state.Linear_Regression)
            ind_arr[0] = this.state.Linear_Regression.indexOf(Math.max(...this.state.Linear_Regression));

            max_arr[1] = Math.max(...this.state.RandomForest2)
            ind_arr[1] = this.state.RandomForest2.indexOf(Math.max(...this.state.RandomForest2));

            max_arr[2] = Math.max(...this.state.GradientBoosting)
            ind_arr[2] = this.state.GradientBoosting.indexOf(Math.max(...this.state.GradientBoosting));

            let max_ind = max_arr.indexOf(Math.max(...max_arr));

            let file_index = ind_arr[max_ind]
            f_name=this.state.files[file_index]
            a_name= algos[max_ind]

        
            console.log(max_arr)
            console.log(ind_arr)
            console.log(max_ind)
            console.log(file_index)
            console.log(f_name)
            console.log(a_name)

            this.setState({
                file_name:f_name,
                algorithm_name:a_name
            })
            console.log(this.state.file_name)

        }
    }

    handleChange(index, event) {
        const updatedArray = [...this.state.feature_values];
        updatedArray[index] = event;
        this.setState({
             feature_values: updatedArray,
         });
        console.log(this.state.feature_values)
    }


    onClick = event => {
        axios({
            method: 'post',
            url: '/users/final_prediction',
            data: {
              file_name: this.state.file_name,
              algorithm_name: this.state.algorithm_name,
              pred_type: this.props.Call,
              features: this.props.keys,
              target: this.props.target,
              inputType:this.props.inputType,
              feature_values:this.state.feature_values
            },
            headers: {'Content-Type': 'application/json'}
            })
            .then((response) => {
                this.setState({
                    result: response.data.result
                })
            })
            .catch(function (response) {
                console.log(response);
            });
    }

    componentDidMount () {
        console.log(this.state.keys)
    }

    render () {
        let features = this.state.keys.map((item,index) =>
            <form>
                <div class="form-group row">
                    <h6 key={item} class="col-sm-2 col-form-label">{item}</h6>
                    <div class="col-sm-10">
                        <input type="text" onChange={e => this.handleChange(index, e.target.value)} class="form-control"></input>
                    </div>
                </div>
            </form>
        );
        return (
            <div className="container">
                <div align="center">
                    <div class="card w-75" align="center">
                        <div class="card-body">
                            <h4>Enter the values for prediction</h4>
                            <br/><br/>
                            {features}
                            <button className='btn btn-primary'  onClick={this.onClick}>Predict</button>
                            <br></br>
                            <br></br>
                            <br></br>
                            <h3>Prediction result: {this.state.result}</h3>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default withRouter(Predictor);