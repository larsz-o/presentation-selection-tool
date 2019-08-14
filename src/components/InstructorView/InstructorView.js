import React, { Component } from 'react';
import Header from '../Header/Header';
import axios from 'axios'; 

class InstructorView extends Component {
    constructor(props){
        super(props);
        this.state = {
            signals: []
        }
    }
    componentDidMount = () => {
        this.getLatestSignals();
    }
    deleteSignal = () => {

    }
    editSignal = () => {

    }
    getLatestSignals = () => {
        axios({
          method: 'GET', 
          url: '/api/signals'
        }).then((response) => {
          this.setState({
            ...this.state,
            signals: response.data
          });
        }).catch((error) => {
          console.log('Error getting signals', error); 
        })
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
                                  <td><button onClick={()=>this.editSignal(signal)}>Edit</button><button onClick={()=>this.deleteSignal(signal)}>Delete</button></td>
                              </tr>
                          );
                      })}
                   </tbody>
               </table>
           </div>
            </main>
        );
    }
}

export default InstructorView;