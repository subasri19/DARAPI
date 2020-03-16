import React, { Component } from 'react'
import axios from 'axios'
import { withRouter } from 'react-router-dom';

class UserFeatureInput extends Component { 
    constructor(props) {
        super(props)
        this.state = {
            filename: this.props.filename,
            inputType:[],
            specs:[]
            // specs:[ "battery_power", "blue", "clock_speed", "dual_sim", "fc", "four_g", "int_memory", "m_dep", "mobile_wt", "n_cores", "pc", "px_height", "px_width", "ram", "sc_h", "sc_w", "talk_time", "three_g", "touch_screen", "wifi"]
        }   
        this.onClick = this.onClick.bind(this)
        this._onRadioSelected = this._onRadioSelected.bind(this)
    }

    componentDidMount = () => {
        console.log(this.props.filename,"userfunc")
        axios({
            method: 'post',
            url: '/users/load_features',
            data: {
                collection: this.props.filename
            },
            headers: {'Content-Type': 'application/json' }
            })
            .then((response) => {
                this.setState({
                    specs: response.data.specs
                })
                this.state.specs.map((item) =>
                    this.setState({
                        inputType:  Object.assign({}, this.state.inputType,{[item]: '2'})
                    })
                );
                console.log(response.data.specs,this.state.filename,this.state.inputType);
            })
            .catch(response => {
                //handle error
                console.log(response);
            });
    }

    _onRadioSelected(shortName, e) {
        const updatedinputType = Object.assign({}, this.state.inputType,{[shortName]: e.target.value})
        this.setState({
            inputType: updatedinputType
        })
        console.log(this.state.inputType)
    }   

    onClick = e => {
        console.log(this.state.inputType,this.state.filename)
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
								this.props.inputType(this.state.inputType)
                this.props.history.push('/visualize')
            })
            .catch(function (response) {
                //handle error
                console.log(response);
            });
    }

    render ()  {
        const optionStyle = {
            'font-weight':'bold',
            'padding':'10px'
        }
        const displayStyle = {
            'display':'flex'
        }
        const labelStyle = {
            'padding':'10px'
        }
        const button = {
            'margin': '40px 0',
            'padding': '20px 0'
        }
        let optionItems = this.state.specs.map((item) =>
        <div align="center">
            <div key={item} style={displayStyle}>
            <option key={item} style={optionStyle}>{item}</option>
            <div>
                <input type="radio" name={item}
                        onChange={(e) => {this._onRadioSelected(item, e)}}
                        checked={this.state.inputType[item] ==='1'}                     
                        value="1"/>
                <label style={labelStyle}>Categorical</label>
                <input type="radio" 
                        onChange={(e) => {this._onRadioSelected(item, e)}}
                        checked={this.state.inputType[item] ==='2'}
                        name={item}                 		 
                        value="2"/>
                <label style={labelStyle}>Continuous</label>
              </div>
              <br/><br/>
            </div>
        </div>
        );
        return ( 
            <div class="container" align="center">
                {optionItems}
                <button type="button"  className="btn btn-primary btn-block" style={button} onClick={this.onClick}>Proceed</button>
            </div>
      )
    }
}

export default withRouter(UserFeatureInput)