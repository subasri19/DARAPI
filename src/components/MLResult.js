import React, { Component } from 'react'
import { withRouter } from 'react-router-dom';
import axios from 'axios'

class MLResult extends Component {
    constructor(props) {
        super(props);
        this.state = {
            // methodName:['a','RandomForest','ac','jeshfjgsf'],
            // methodScore:['3','4','5','6']
            files: this.props.files,
            Linear_SVM: this.props.Linear_SVM,
            RandomForest1:this.props.RandomForest1,
            DecisionTree:this.props.DecisionTree,
            Adaptive_GB:this.props.Adaptive_GB,
            Linear_Regression:this.props.Linear_Regression,
            RandomForest2:this.props.RandomForest2,
            GradientBoosting:this.props.GradientBoosting,
            Call:this.props.Call,
        };
        console.log(this.props.files)
    }

    onClick = event => {
        event.preventDefault()
        this.props.history.push('/predict')      
    }

    render(){

        let algorithms=[]
        let headers =[]
        let rows=[]
        headers.push(<th>Algorithms/Datasets</th>)

        if(this.state.Call=="Classification")
        {
            algorithms=['Linear_SVM','RandomForest','DecisionTree','Adaptive_GB']
            let Linear_SVM_list=[]
            let RandomForest_list=[]
            let DecisionTree_list=[]
            let Adaptive_GB_list=[]

            Linear_SVM_list.push(<td>Linear_SVM</td>)
            RandomForest_list.push(<td>RandomForest</td>)
            DecisionTree_list.push(<td>DecisionTree</td>)
            Adaptive_GB_list.push(<td>Adaptive_GB</td>)

            {this.state.Linear_SVM.map((value,index)=>{
                Linear_SVM_list.push(<td>{value}</td>)
            })}

            {this.state.RandomForest1.map((value,index)=>{
                RandomForest_list.push(<td>{value}</td>)
            })}

            {this.state.DecisionTree.map((value,index)=>{
                DecisionTree_list.push(<td>{value}</td>)
            })}

            {this.state.Adaptive_GB.map((value,index)=>{
                Adaptive_GB_list.push(<td>{value}</td>)
            })}

            rows.push(<tr>{Linear_SVM_list}</tr>)
            rows.push(<tr>{RandomForest_list}</tr>)
            rows.push(<tr>{DecisionTree_list}</tr>)
            rows.push(<tr>{Adaptive_GB_list}</tr>)
        }                
        else
        {
            algorithms=['Linear_Regression','RandomForest','GradientBoosting']
            let Linear_Regression_list=[]
            let RandomForest_list=[]
            let GradientBoosting_list=[]

            Linear_Regression_list.push(<td>Linear_Regression</td>)
            RandomForest_list.push(<td>RandomForest</td>)
            GradientBoosting_list.push(<td>GradientBoosting</td>)

            {this.state.Linear_Regression.map((value,index)=>{
                Linear_Regression_list.push(<td>{value}</td>)
            })}

            {this.state.RandomForest2.map((value,index)=>{
                RandomForest_list.push(<td>{value}</td>)
            })}

            {this.state.GradientBoosting.map((value,index)=>{
                GradientBoosting_list.push(<td>{value}</td>)
            })}

            rows.push(<tr>{Linear_Regression_list}</tr>)
            rows.push(<tr>{RandomForest_list}</tr>)
            rows.push(<tr>{GradientBoosting_list}</tr>)
        }
        
        {this.state.files.map((name, index) => {
            headers.push(<th>{name}</th>)
          })}

        return(
            <div class="container">
            <table class ="table">
                <thead>
                    <tr>
                        {headers}
                    </tr>
                </thead>
                <tbody>
                    {rows}
                </tbody>
            </table>
            <button className='btn btn-primary'  onClick={this.onClick}>Proceed</button>
            </div>
        )
    }
}

export default withRouter(MLResult);