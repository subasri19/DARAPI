import React, { Component } from 'react'
import axios from 'axios'
import Circle from 'react-circle'
import  MultiSelectReact  from 'multi-select-react';
import { withRouter } from 'react-router-dom';


class SelectTarget extends Component { 
    constructor(props) {
        super(props)
        this.state = {
          cols:[],
          value: props.value,
          specs:[],
          score:[],
          target:'',
          percent:[],
          inputType: this.props.inputType
        }
        this.handleChange = this.handleChange.bind(this)
        this.onClick = this.onClick.bind(this)
        this.roundoff = this.roundoff.bind(this)
        this.visualize = this.visualize.bind(this)
    }

    componentDidMount = () => {
      console.log(this.state.inputType,this.props.inputType)
      axios({
        method: 'post',
        url: '/users/target',
        data: {
          collection: this.props.filename
        },
        headers: {'Content-Type': 'application/json'}
        })
        .then((response) => {
            console.log(response.data.result)
            this.setState({ 
              cols: response.data.result 
            })
            console.log(this.state.cols)
        })
        .catch(function (response) {
            //handle error
            console.log(response);
        });
    }

    handleChange(event) {
      this.setState({value: event.target.value});
      console.log(this.state.value)
    }

    roundoff(my_array){
      var x = 0;
      var len = my_array.length
      while(x < len){ 
        my_array[x] = my_array[x].toFixed(2); 
          x++
      }
      return my_array;
    }

    onClick(e) {
      console.log(this.state.inputType[this.state.value])
      axios({
        method: 'post',
        url: '/users/features',
        data: {
          collection: this.props.filename,
          target: this.state.value,
          inputType:this.props.inputType
        },
        headers: {'Content-Type': 'application/json'}
        })
        .then((response) => {
          this.setState({ 
            specs: response.data.res_specs,
            score: this.roundoff(response.data.res_score),
            percent: this.roundoff(response.data.res_percent),
            target: this.state.value
          })
          this.props.specs(this.state.specs)
          this.props.score(this.state.score)
          this.props.percent(this.state.percent)
          this.props.target(this.state.target)
          console.log(this.state.specs)
          console.log(this.state.score)
          console.log(this.state.percent)
          this.props.history.push(`/features`)
        })
        .catch(function (response) {
            //handle error
            console.log(response);
        });
    }

    visualize = e => {
      axios({
        method: 'post',
        url: '/users/visualize',
        data: {
          collection: this.props.filename
        },
        headers: {'Content-Type': 'application/json'}
        })
        .then((response) => {
          this.setState({ 
            specs: response.data.specs
          })
            console.log(response)
            this.props.specs(this.state.specs)
            this.props.history.push('/visualize')
        })
        .catch(function (response) {
            //handle error
            console.log(response);
        });
    }

    render ()  {
        let optionItems = this.state.cols.map((item) =>
        <option key={item}>{item}</option>
      );
        return ( 
          <div align="center">
          <h3>Select the target attribute which needs to be predicted</h3>
          <select class="custom-select" value={this.state.value} name={this.props.name} onChange={this.handleChange.bind(this)}>
            {optionItems}
          </select>
          <br></br>
          <br></br>
          <br></br>
          <button type="button" class="btn btn-primary btn-lg" onClick={this.onClick}>Proceed</button>
          <br/>
          <br/>
          </div>
      )
    }
}

export default withRouter(SelectTarget)