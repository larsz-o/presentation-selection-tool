import React, { Component } from 'react';
import './App.css';

class App extends Component {
    constructor(props){
      super(props);
      this.state = {
        signals: [{signal: '', student: '', claimed: false}],
        open: false
      }
    }
  
    openDialogue = () => {
      this.setState({
        ...this.state, 
        open: true
      })
    }
  render() {
    return(
      <main>
        <h1>Signalling Pathway Presentations</h1>
        <h2>Claim the signalling transduction pathway you'd like to present on.</h2>
        <ol type="1">
          {this.state.signals.map((signal, i) => {
            return(
              <li key={i}>{signal.signal} {signal.claimed ? (<button onClick={()=>this.openDialgoue()}>Claim</button>) : (<p>Already claimed</p>)}</li>
            )
          })}
        </ol>
      </main>
    );
}}

export default App;
