import React, { Component } from 'react';
import Header from '../Header/Header';
import axios from 'axios'; 
import { Dialog, DialogTitle } from '@material-ui/core';

class InstructorView extends Component {
    constructor(props){
        super(props);
        this.state = {
            signals: [],
            open: false,
            editingSignal: ''
        }
    }
    closeDialogue = () => {
        this.setState({
          ...this.state,
          open: false
        })
      }
    componentDidMount = () => {
        this.getLatestSignals();
    }
    deleteSignal = (signal) => {
        if (window.confirm(`Are you sure you want to delete ${signal.signal}?`)) {
            axios({
                method: 'DELETE',
                url: 'api/signals',
                data: signal
            }).then(() =>{
                this.getLatestSignals();
            }).catch((error) => {
                console.log('Error deleting', error);
            })
        }
    }
    editSignal = () => {
        axios({
            method: 'PUT',
            url: 'api/signals',
            data: this.state.editingSignal
        }).then(() =>{
            this.getLatestSignals();
        }).catch((error) => {
            console.log('Error updating', error);
        })
    }
    getLatestSignals = () => {
        axios({
          method: 'GET', 
          url: 'api/signals'
        }).then((response) => {
          this.setState({
            ...this.state,
            signals: response.data
          });
        }).catch((error) => {
          console.log('Error getting signals', error); 
        })
      }
      handleChangeFor = (event) => {
          this.setState({
              ...this.state,
              editingSignal: {...this.state.editingSignal, signal: event.target.value}
          })
      }
      openDialogue = (signal) => {
        this.setState({
          ...this.state,
          open: true,
          editingSignal: signal
        });
      }
    render(){
        return(
            <main>
                <Header/>
                <div className="header">
                    <h1>Edit Signal Pathways</h1>
                </div>
           <div class="container">
               <table>
                   <thead>
                       <tr>
                           <td>Signal Pathway</td>
                           <td>Actions</td>
                       </tr>
                   </thead>
                   <tbody>
                      {this.state.signals.map((signal, i) => {
                          return(
                              <tr key={i}>
                                  <td>{signal.signal}</td>
                                  <td><button onClick={()=>this.openDialogue(signal)}>Edit</button><button onClick={()=>this.deleteSignal(signal)}>Delete</button></td>
                              </tr>
                          );
                      })}
                   </tbody>
               </table>
           </div>
           <Dialog open={this.state.open}>
          <div className="dialog-form">
            <DialogTitle>Enter signal information</DialogTitle>
            <label>Name: </label><input onChange={(event) => this.handleChangeFor(event)} />
            <div className="flex-box">
              <button onClick={() => this.editSignal()}>Submit</button>
              <button className="cancel" onClick={() => this.closeDialogue()}>Cancel</button>
            </div>

          </div>
        </Dialog>
            </main>
        );
    }
}

export default InstructorView;