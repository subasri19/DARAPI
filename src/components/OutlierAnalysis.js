import React, { Component } from 'react'
import axios from 'axios'
import { withRouter } from 'react-router-dom'


class OutlierAnalysis extends Component { 
    constructor(props) {
        super(props)
        this.state = {
            out_opt:'',
            localBoxPlot: [],
            outlier_cols:[]
        }
        this.onClick1 = this.onClick1.bind(this)
        this.onClick2 = this.onClick2.bind(this)
        this.onClick3 = this.onClick3.bind(this)
    }

    componentDidMount(){
        axios({
            method: 'post',
            url: '/users/getoutliercols',
            data: {
              collection: this.props.filename,
            },
            headers: {'Content-Type': 'application/json'}
            })
            .then((response) => {
                console.log(response.data.outliercols);
                // this.props.filename(this.state.filename)
                this.setState({ 
                    outlier_cols:response.data.outliercols
                  })
                
            })
            .catch(function (response) {
                console.log(response);
            });
            
    }

    outlier_analysis(outlier_option){
        this.setState({ 
            out_opt:outlier_option
          })
        this.props.out_opt(this.state.out_opt)
        console.log(this.props.filename)
        axios({
            method: 'post',
            url: '/users/outliers',
            data: {
              collection: this.props.filename,
              option: outlier_option
            },
            headers: {'Content-Type': 'application/json'}
            })
            .then((response) => {
                console.log(response.data.result);
            })
            .catch(function (response) {
                console.log(response);
            });
    }

    onClick1(e) {
        this.outlier_analysis(1)
        this.props.history.push('/target')
    }

    onClick2(e) {
        this.outlier_analysis(2)
        this.outlier_analysis(3)
        this.props.history.push('/target')
    }

    onClick3(e) {
        this.outlier_analysis(4)
        this.props.history.push('/target')
    }
        

    render ()  {
        const image = {
            width: '300px', 
            height: '300px'
        }
        let arr =  this.state.outlier_cols
        for(var j=0; j<arr.length; j++){
            arr[j] = "Box_plot_of_"+ arr[j]
        }
        let arrdata = arr
        let bp=[]
        for(var i=0; i<arrdata.length; i++){
            bp.push(require('../../images/'+arrdata[i]+'.png'))
        }
        
        let box = bp.map((name) =>
                <div class="text-center">
                    <img class="img-responsive" src={name} style={image}/>
                </div>
            );

            
        return ( 
          <div align="center"><br/>
              <h5>fc and p_height are the features that have outliers</h5>
              {/* <img class="img-responsive" src='../../images/Box_plot_of_fc.png' style={image}/> */}
            {box}
          <br></br>
          <br></br>
          <h3>Choose an appropriate option</h3>
          <br></br>
          <button type="button" class="btn btn-primary btn-lg" onClick={this.onClick1}>Procced without any changes</button>
          <br></br>
          <br></br>
          <br></br>
          <button type="button" class="btn btn-primary btn-lg" onClick={this.onClick2}>Replace the outliers and proceed</button>
          <br></br>
          <br></br>
          <br></br>
          <button type="button" class="btn btn-primary btn-lg" onClick={this.onClick3}>Drop outliers and proceed</button>
          </div>

      )
    }

}

export default withRouter(OutlierAnalysis)