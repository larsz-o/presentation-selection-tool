import React, { Component } from 'react';
import {HashRouter as Router, Route, Switch } from 'react-router-dom'; 
import StudentView from './components/StudentView/StudentView';
import InstructorView from './components/InstructorView/InstructorView';
import './App.css';


class App extends Component {
  render() {
    return (
      <Router>
        <Switch>
        <Route exact path="/" component={StudentView}/>
        <Route path="/admin" component={InstructorView}/>
        </Switch>
     
      </Router>
    );
  }
}

export default App;
