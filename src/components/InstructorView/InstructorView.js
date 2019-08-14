import React, { Component } from 'react';

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

            </main>
        );
    }
}

export default InstructorView;