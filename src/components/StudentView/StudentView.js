import React, { Component } from 'react';
import { Dialog, DialogTitle } from '@material-ui/core';

class StudentView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      signals: [{ signal: 'first one', student: '', email: '', claimed: false }, { signal: 'second one', student: '', claimed: false }],
      open: false,
      signalSelected: '',
      name: '',
      email: '', 
      index: ''
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
    })
  }
  closeDialogue = () => {
    this.setState({
      ...this.state,
      open: false
    })
  }
  handleChangeFor = (event, property) => {
    this.setState({
      ...this.state,
      [property]: event.target.value
    })
  }
  openDialogue = (signal, i) => {
    this.setState({
      ...this.state,
      open: true,
      signalSelected: signal,
      index: i
    });
  }

  render() {
    return (
      <main>
        <div class="header">
            <h1>Signaling Pathway Presentations</h1>
            <h2>RBIF 102: Fall-2 2019</h2>
            <p className="lead">Claim the signaling transduction pathway you'd like to present on.</p>
        </div>
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
                <tr key={i}><td>{signal.signal}</td> <td>{!signal.claimed ? (<button className="claim" onClick={() => this.openDialogue(signal.signal, i)}>Claim</button>) : (<p>Already claimed</p>)}</td><td>{signal.student} <span> - </span>{signal.email}</td></tr>
              )
            })}
          </tbody>

        </table>
        </div>
        
        <Dialog open={this.state.open}>
          <div className="dialog-form">
            <DialogTitle>Enter your information</DialogTitle>
            <p>You are claiming: <b>{this.state.signalSelected}</b></p>
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
