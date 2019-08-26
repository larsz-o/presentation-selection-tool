import React, { Component } from 'react';
import Header from '../Header/Header';
import axios from 'axios';
import { Dialog, DialogTitle, Select, MenuItem, Input } from '@material-ui/core';
import swal from 'sweetalert'; 
import TopicsTable from './TopicsTable';

class InstructorView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            topics: [],
            categories: [],
            activeTerm: [],
            newTopic: '',
            activeTopic: '',
            term: '',
            filter: '',
            year: 0,
            category: '',
            termEdit: false,
            newDialog: false,
            editCategory: true
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
        this.getLatestData();
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
    getCategories = (array) => {
        let categories = [];
        for (let i = 0; i < array.length; i++) {
            let test = array[i].category;
            if (categories.indexOf(test) == -1) {
                categories.push(array[i].category)
            }
        }
        this.setState({
            ...this.state,
            categories: categories
        })
    }
    getLatestData = () => {
        axios({
            method: 'GET',
            url: 'api/topics/admin'
        }).then((response) => {
            this.getCategories(response.data);
            this.setState({
                ...this.state,
                topics: response.data,
            });
        }).catch((error) => {
            console.log('Error getting topics', error);
        })
    }
    handleTermChange = (event, property) => {
        this.setState({
            ...this.state,
            [property]: event.target.value
        })
    }
    openNewDialogue = () => {
        this.setState({
            ...this.state,
            newDialog: true,
        });
    }
    postTopic = () => {
        axios({
            method: 'POST',
            url: 'api/topics',
            data: { topic: this.state.newTopic, claimed: false, category: this.state.category }
        }).then(() => {
            this.closeDialogue();
            swal('Success', 'The topic has been created!', 'success');
            this.setState({
                ...this.state,
                newTopic: '',
                category: ''
            })
            this.getLatestData();
        }).catch((error) => {
            console.log('Error posting topic', error);
        })
    }
    saveTerm = () => {
        let year = parseInt(this.state.year);
        axios({
            method: 'POST',
            url: 'api/term',
            data: { term: this.state.term, year: year }
        }).then(() => {
            this.getActiveTerm();
            this.setState({
                ...this.state,
                termEdit: false,
                term: '',
                year: ''
            })
        }).catch((error) => {
            console.log('error posting term', error);
        })
    }
    toggleEdit = () => {
        this.setState({ ...this.state, editCategory: false });
    }
    render() {
        let topics = this.state.topics; 
        if (this.state.filter !== ''){
            topics.filter(topic => topic.category === this.state.filter); 
        }
        return (
            <main>
                <Header term={this.state.activeTerm} />
                <div className="header">
                    <h1>Topics Console</h1>
                </div>

                {this.state.termEdit && <div className="term-select">
                    <label>Term:</label>
                    <Select
                        value={this.state.term}
                        onChange={(event) => this.handleTermChange(event, 'term')}
                    >
                        <MenuItem value={'Fall-1'}>Fall-1</MenuItem>
                        <MenuItem value={'Fall-2'}>Fall-2</MenuItem>
                        <MenuItem value={'Spring-1'}>Spring-1</MenuItem>
                        <MenuItem value={'Spring-2'}>Spring-2</MenuItem>
                    </Select>
                    <label>Year:</label><Input onChange={(event) => this.handleTermChange(event, 'year')} />
                    <button onClick={() => this.saveTerm()}>Save</button>
                </div>}
                <div className="center breathing-room"><button onClick={() => this.openNewDialogue()}>Add new topic</button>
                    {!this.state.termEdit && <p onClick={() => this.setState({ ...this.state, termEdit: true })} className="cancel link">Edit term display dates</p>}</div>
                    {/* to do: filter results */}
                    <div className="flex-box col-11">
                        <label>Filter by topic: </label><Select onChange={(event)=>this.handleTermChange(event, 'filter')} value={this.state.filter}>
                        <MenuItem value="">---</MenuItem>
                        {this.state.categories.map((category, i) => {
                            return(
                                <MenuItem value={category} key={i}>{category}</MenuItem>
                            );
                        })}
                        </Select>
                    </div>
                    <TopicsTable getLatestData={this.getLatestData} topics={topics} closeDialogue={this.closeDialogue}/>
                {/* create a new topic */}
                <Dialog open={this.state.newDialog}>
                    <div className="dialog-form">
                        <DialogTitle>Enter topic information</DialogTitle>
                        <label>Topic: </label><Input value={this.state.newTopic} onChange={(event) => this.handleTermChange(event, 'newTopic')} />
                        <label>Category:</label><Select value={this.state.category} onChange={(event)=>this.handleTermChange(event, 'category')}>
                            <MenuItem value="">---</MenuItem>
                            {this.state.categories.map((category, i) => {
                                return (
                                    <MenuItem key={i} value={category}>{category}</MenuItem>
                                );
                            })}
                        </Select>
                        {this.state.editCategory ? (<p className="cancel link" onClick={() => this.toggleEdit()}>Category not listed?</p>): (<div><p>Create a new category: </p><Input onChange={(event) => this.handleTermChange(event, 'category')} /></div>) }
                        <div className="flex-box">
                            <p className="cancel" onClick={() => this.closeDialogue()}>Cancel</p>
                            <button onClick={() => this.postTopic()}>Submit</button>
                        </div>

                    </div>
                </Dialog>
            </main>
        );
    }
}

export default InstructorView;