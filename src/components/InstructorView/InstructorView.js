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
                <h2>Edit Signal Pathways</h2>
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
                                  <td><button>Edit</button><button>Delete</button></td>
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