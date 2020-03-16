import React, { Component } from 'react'
        import { withRouter } from 'react-router-dom';
    
    
        class DataVisualization extends Component { 
            constructor(props) {
                super(props)
                this.state = {
                    specs: this.props.specs,
                    // specs:[ "battery_power", "blue", "clock_speed", "dual_sim", "fc", "four_g", "int_memory", "m_dep", "mobile_wt", "n_cores", "pc", "px_height", "px_width", "ram", "sc_h", "sc_w", "talk_time", "three_g", "touch_screen", "wifi"],
                    box_graph:[],
                    hist_graph:[]
                }   
                this.onClick = this.onClick.bind(this)
            }
    
            componentDidMount = () => {
                this.setState({
                    specs: this.props.specs
                })
                console.log(this.state.specs, this.props.specs)
                let localBoxPlot = []
                let localHistPlot = []
                let arrdata = this.state.specs;
                let himage="Distribution_of_"
                let bimage="Box_plot_of_"
                for(var i=0; i<arrdata.length; i++){
                    localBoxPlot.push(require('../../images/'+bimage+arrdata[i]+'.png'))
                    localHistPlot.push(require('../../images/'+himage+arrdata[i]+'.png'))
                }
                this.setState({
                    box_graph: localBoxPlot,
                    hist_graph: localHistPlot
                })
            }
    
            onClick(e) {
                this.props.history.push('/outliers')
            }
    
            render ()  {
                const image = {
                    width: '300px', 
                    height: '300px'
                }
    
                const data = {
                    'text-align':'center'
                }
    
                const spec = {
                    'text-align':'center',
                    'padding': '135px 0'
                }
    
                const button = {
                    'margin': '40px 0',
                    'padding': '20px 0'
                }
    
                let item = this.state.specs.map((item) =>
                    <h6 class="text-center" style={spec} key={item}>{item}</h6>
                );
                let box = this.state.box_graph.map((name) =>
                    <div class="text-center">
                        <img class="img-responsive" src={name} style={image}/>
                    </div>
                );
                let hist = this.state.hist_graph.map( (name) =>
                    <div class="text-center">
                        <img class="img-responsive" src={name} style={image}/>
                    </div>
                );
                return ( 
                <div class="container" align="center">
                    <table class="table">
                    <thead style={data}>
                        <tr>
                            <th scope="col">Feature Name</th>
                            <th scope="col">Box plot</th>
                            <th scope="col">Histogram</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{item}</td>
                            <td>{box}</td>
                            <td>{hist}</td>
                        </tr>
                    </tbody>
                    </table>
                    <button type="button"  className="btn btn-primary btn-block" style={button} onClick={this.onClick}>Proceed</button>
                </div>
            )
            }
        }
    
        export default withRouter(DataVisualization)