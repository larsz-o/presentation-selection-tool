import React, { Component } from 'react';
import {HashRouter as Router, Route } from 'react-router-dom'; 
import StudentView from './components/StudentView/StudentView';
import './App.css';


class App extends Component {
  render() {
    return (
      <Router>
        <Route exact path="/" component={StudentView}/>
      </Router>
    );
  }
}

export default App;
