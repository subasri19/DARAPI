import React, { Component } from 'react'
import ReactFileReader from 'react-file-reader'
import { CsvToHtmlTable } from 'react-csv-to-table';
import axios from 'axios'
import { withRouter } from 'react-router-dom';


class FileUpload extends Component {
    constructor() {
        super();
        this.state = {
        csvData: '',
        data_file:'',
        filename:''
         };
         this.test = this.test.bind(this)
         this.onClick = this.onClick.bind(this)
         this.handleFiles = this.handleFiles.bind(this)
    }

    handleFiles = files => {
        let reader = new FileReader();
        var data_file= document.querySelector('input').files[0];
        
        reader.onload = () => {
          // Use reader.result
          this.setState({
            csvData: reader.result
          })
        }
        reader.readAsText(data_file);
      }

    onClick = event => {
        event.preventDefault()
        var data_file= document.querySelector('input').files[0];
        const formData = new FormData();
        formData.append("data_file", data_file);
        this.filename = this.props

        axios({
            method: 'post',
            url: '/users/store_to_db',
            data: formData,
            headers: {'Content-Type': 'multipart/form-data' }
            })
            .then((response) => {
                this.setState({
                    filename: response.data.filename
                })
                this.props.filename(this.state.filename)
                // console.log(this.props.filename)
                console.log(response.data.filename);
                // this.props.history.push(`/target`)
                this.props.history.push(`/input`)

            })
            .catch(response => {
                //handle error
                console.log(response);
            });
      }

      test(e) {
        e.preventDefault()
        this.props.history.push(`/target`)
    }

    
   
    render () {
        return ( 
        <div align="center">
            <div class="card w-75" align="center">
                <div class="card-body">
                    <h5 class="card-title">Upload the Dataset</h5>
                    <p class="card-text">Kindly click the upload button and select a dataset which is in the .csv format</p>
                    <ReactFileReader fileTypes={".csv"} handleFiles={this.handleFiles}>
                        <button className='btn btn-primary'>Browse File</button>
                    </ReactFileReader>
                        <br></br>
                        <button className='btn btn-primary'  onClick={this.onClick}>Upload</button>
                </div>
            </div>
            
            <CsvToHtmlTable
               data={this.state.csvData}
               csvDelimiter=","
               tableClassName="table table-striped table-hover"
            />
        </div>
              
        )
    }
}

export default withRouter(FileUpload)