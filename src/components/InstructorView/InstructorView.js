import React, { Component } from 'react';
import Header from '../Header/Header';
import axios from 'axios'; 
import { Dialog, DialogTitle, Select, MenuItem, Input} from '@material-ui/core';

class InstructorView extends Component {
    constructor(props){
        super(props);
        this.state = {
            signals: [],
            open: false,
            editingSignal: '',
            term: '',
            year: 0, 
            activeTerm: [],
            newDialog: false,
            newSignal: ''
        }
    }
    closeDialogue = () => {
        this.setState({
          ...this.state,
          open: false, 
          newDialog: false
        })
      }
    componentDidMount = () => {
        this.getLatestSignals();
        this.getActiveTerm();
    }
    deleteSignal = (signal) => {
        if (window.confirm(`Are you sure you want to delete ${signal.signal}?`)) {
            axios({
                method: 'DELETE',
                url: 'api/signals',
                data: signal
            }).then(() =>{
                this.getLatestSignals();
                alert(`${signal.signal} deleted!`)
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
            alert('Edit successful');
        }).catch((error) => {
            console.log('Error updating', error);
        })
    }
    getActiveTerm = () => {
        axios({
            method: 'GET',
            url: 'api/term',
        }).then((response) => {
            console.log('success');
            this.setState({
                ...this.state,
                activeTerm: response.data
            })
        }).catch((error) => {
            console.log('error getting term', error)
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
      handleTermChange = (event, property) => {
        this.setState({
            ...this.state,
            [property]: event.target.value
        })
    }
      openDialogue = (signal) => {
        this.setState({
          ...this.state,
          open: true,
          editingSignal: signal
        });
      }
      openNewDialogue = () => {
        this.setState({
          ...this.state,
          newDialog: true,
        });
      }
      postSignal = () => {
          axios({
              method: 'POST',
              url: 'api/signals',
              data: {signal: this.state.newSignal, claimed: false}
          }).then(() => {
              this.getLatestSignals();
          }).catch((error) => {
              console.log('Error posting signal', error);
          })
      }
      saveTerm = () => {
          let year = parseInt(this.state.year);
          axios({
              method: 'POST',
              url: 'api/term',
              data: {term: this.state.term, year: year}
          }).then(() => {
              console.log('success');
              this.getActiveTerm();
              this.setState({
                  ...this.state, 
                  term: '',
                  year: ''
              })
          }).catch((error) => {
            console.log('error posting term', error);
          })
      }
    render(){
        return(
            <main>
                <Header term={this.state.activeTerm}/>
                <div className="header">
                    <h1>Edit Signal Pathways</h1>
                </div>
                <div className="term-select">
                <label>Term:</label>
                <Select
          value={this.state.term}
          onChange={(event)=>this.handleTermChange(event, 'term')}
        >
          <MenuItem value={'Fall-1'}>Fall-1</MenuItem>
          <MenuItem value={'Fall-2'}>Fall-2</MenuItem>
          <MenuItem value={'Spring-1'}>Spring-1</MenuItem>
          <MenuItem value={'Spring-2'}>Spring-2</MenuItem>
        </Select>
        <label>Year:</label><Input onChange={(event)=>this.handleTermChange(event, 'year')}/>
        <button onClick={()=>this.saveTerm()}>Save</button>
                </div>
               <div className="center breathing-room"><button onClick={()=>this.openNewDialogue()}>Add new signal</button></div>
           <div className="container">
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
            <label>Name: </label><input value={this.state.editingSignal.signal} onChange={(event) => this.handleChangeFor(event)} />
            <div className="flex-box">
              <button onClick={() => this.editSignal()}>Submit</button>
              <button className="cancel" onClick={() => this.closeDialogue()}>Cancel</button>
            </div>

          </div>
        </Dialog>
        <Dialog open={this.state.newDialog}>
          <div className="dialog-form">
            <DialogTitle>Enter signal information</DialogTitle>
            <label>Name: </label><input value={this.state.newSignal} onChange={(event) => this.handleTermChange(event, 'newSignal')} />
            <div className="flex-box">
              <button onClick={() => this.postSignal()}>Submit</button>
              <button className="cancel" onClick={() => this.closeDialogue()}>Cancel</button>
            </div>

          </div>
        </Dialog>
            </main>
        );
    }
}

export default InstructorView;