import React, { Component } from 'react';
import { Dialog, DialogTitle, Paper, Input} from '@material-ui/core';
import axios from 'axios';
import Header from '../Header/Header';
import swal from 'sweetalert';

class StudentView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      open: false,
      topicSelected: '',
      name: '',
      email: '',
      index: '',
      student: '',
      activeTerm: [],
      lock: false,
      params: ''
    }
  }
  claimTopic = () => {
    let topics = this.state.data.slice();
    topics[this.state.index] = { topic: this.state.topicSelected.topic, student: this.state.name, email: this.state.email, claimed: true };
    this.setState({
      ...this.state,
      open: false,
      data: topics
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
    const { match: { params } } = this.props;
    let keyword = params.keyword;
    this.setState({
      ...this.state,
      params: keyword
    })
    this.getLatestData(keyword);
    this.getActiveTerm();
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
  getLatestData = (keyword) => {
    axios({
      method: 'GET',
      url: `api/topics?name=${keyword}`
    }).then((response) => {
      this.setState({
        ...this.state,
        data: response.data
      });
    }).catch((error) => {
      console.log(`Error getting ${this.state.params}`, error);
    })
  }
  handleChangeFor = (event, property) => {
    this.setState({
      ...this.state,
      [property]: event.target.value
    })
  }
  openDialogue = (topic, i, id) => {
    this.setState({
      ...this.state,
      open: true,
      topicSelected: { topic: topic, id: id },
      index: i
    });
  }
  postToServer = () => {
    axios({
      method: 'PUT',
      url: `api/topics/claim`,
      data: { topic: this.state.topicSelected.topic, student: this.state.student, email: this.state.email, claimed: true, id: this.state.topicSelected.id }
    }).then((response) => {
      this.getLatestData(this.state.params);
      this.setState({
        ...this.state,
        lock: true
      })
    }).catch((error) => {
      swal('Uh-oh','Something went wrong, please try again.', 'error');
      console.log('Error posting to server', error);
    })
  }
  render() {
    return (
      <div>
        {!this.state.lock ? (<main>
          <Header term={this.state.activeTerm} />
          <div className="header">
            {this.state.params === 'signals' && <h1>Signal Pathway Presentations</h1>} {this.state.params === 'clinical' && <h1>Clinical Trial Discussions</h1>}
          </div>
          <p className="lead center">Choose a topic below. Once you've claimed a topic, you are responsible for it. <b>Please only pick one.</b></p>
          <div className="container">
            <table>
              <thead>
                <tr>
                  <td>Topic</td>
                  <td>Status</td>
                  <td>Claimed by</td>
                </tr>
              </thead>
              <tbody>
                {this.state.data.map((topic, i) => {
                  return (
                    <tr key={i}><td>{topic.topic}</td> <td>{!topic.claimed ? (<button className="claim" onClick={() => this.openDialogue(topic.topic, i, topic.id)}>Claim</button>) : (<p>Already claimed</p>)}</td><td>{topic.student} <span> - </span>{topic.email}</td></tr>
                  )
                })}
              </tbody>

            </table>
          </div>

          <Dialog open={this.state.open}>
            <div className="dialog-form">
              <DialogTitle><h3>Enter your information</h3></DialogTitle>
              <p>You are claiming: <b>{this.state.topicSelected.topic}</b></p>
              <p className="warning">You will not be able to change this selection after you submit it. Please be sure this is the selection you want.</p>
              <label>Name: </label><Input onChange={(event) => this.handleChangeFor(event, 'student')} required />
              <label>Email: </label><Input onChange={(event) => this.handleChangeFor(event, 'email')} required />
              <div className="flex-box">
                <p className="cancel" onClick={() => this.closeDialogue()}>Cancel</p>
                <button onClick={() => this.claimTopic()}>Submit</button>
              </div>

            </div>
          </Dialog>
        </main>) : (<main>
          <Paper className="confirmation">
         <div className="breathing-room">
         <DialogTitle><h3>Thank you for your selection</h3></DialogTitle>
              <p>Your presentation will be on: {this.state.topicSelected.topic}</p>
              <p>Please note this for your records and then close this window.</p>
            </div>

          </Paper></main>)}


      </div>
    );
  }
}

export default StudentView;
