import React, { Component } from 'react';
import { Dialog, DialogTitle } from '@material-ui/core';
import axios from 'axios';
import Header from '../Header/Header';

class StudentView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      signals: [],
      open: false,
      signalSelected: '',
      name: '',
      email: '', 
      index: '', 
    }
  }
  claimSignal = () => {
    let signals = this.state.signals.slice();
    console.log(signals);
    signals[this.state.index] = {signal: this.state.signalSelected, student: this.state.name, email: this.state.email, claimed: true};
    console.log(signals);
    this.setState({
      ...this.state, 
      open: false,
      signals: signals
    });
    this.postToServer();
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
  handleChangeFor = (event, property) => {
    this.setState({
      ...this.state,
      [property]: event.target.value
    })
  }
  openDialogue = (signal, i, id) => {
    this.setState({
      ...this.state,
      open: true,
      signalSelected: {signal: signal, id: id},
      index: i
    });
  }
  postToServer = () => {
    axios({
      method: 'PUT', 
      url: 'api/signals/claim',
      data: {signal: this.state.signalSelected.signal, student: this.state.student, email: this.state.email, claimed: true, id: this.state.signalSelected.id}
    }).then((response) => {
      this.getLatestSignals();
    }).catch((error) => {
      alert('Something went wrong, please try again.')
      console.log('Error posting to server', error); 
    })
  }
  render() {
    return (
      <main>
        <Header/>
        <div className="header">
                    <h1>Signaling Pathway Presentations</h1>
                </div>
        <p className="lead center">Claim the signaling transduction pathway you'd like to present on. First come, first serve.</p>
        <div className="container">
        <table>
          <thead>
            <tr>
              <td>Signal Transduction Pathway</td>
              <td>Status</td>
              <td>Claimed by</td>
            </tr>
          </thead>
          <tbody>
            {this.state.signals.map((signal, i) => {
              return (
                <tr key={i}><td>{signal.signal}</td> <td>{!signal.claimed ? (<button className="claim" onClick={() => this.openDialogue(signal.signal, i, signal.id)}>Claim</button>) : (<p>Already claimed</p>)}</td><td>{signal.student} <span> - </span>{signal.email}</td></tr>
              )
            })}
          </tbody>

        </table>
        </div>
        
        <Dialog open={this.state.open}>
          <div className="dialog-form">
            <DialogTitle>Enter your information</DialogTitle>
            <p>You are claiming: <b>{this.state.signalSelected.signal}</b></p>
            <label>Name: </label><input onChange={(event) => this.handleChangeFor(event, 'name')} />
            <label>Email: </label><input onChange={(event) => this.handleChangeFor(event, 'email')} />
            <div className="flex-box">
              <button onClick={() => this.claimSignal()}>Submit</button>
              <button className="cancel" onClick={() => this.closeDialogue()}>Cancel</button>
            </div>

          </div>
        </Dialog>
      </main>
    );
  }
}

export default StudentView;
