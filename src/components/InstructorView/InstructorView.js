import React, { Component } from 'react';
import Header from '../Header/Header';
import axios from 'axios';
import { Dialog, DialogTitle, Select, MenuItem, Input } from '@material-ui/core';
import swal from 'sweetalert'; 

class InstructorView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            topics: [],
            categories: [],
            activeTerm: [],
            filtered: [],
            editingTopic: '',
            newTopic: '',
            activeTopic: '',
            term: '',
            filter: '',
            year: 0,
            category: '',
            termEdit: false,
            open: false,
            newDialog: false,
            editCategory: true
        }
    }
    applyFilter = () => {
        let topics = this.state.topics; 
        if (this.state.filter !== ''){
            let filtered = topics.filter(topic => topic.category === this.state.filter); 
            console.log(filtered);
            this.setState({
                ...this.state,
                filtered: filtered
            })
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
    deleteTopic = (topic) => {
        if (window.confirm(`Are you sure you want to delete ${topic.topic}?`)) {
            axios({
                method: 'DELETE',
                url: 'api/topics',
                data: topic
            }).then(() => {
                this.getLatestData();
                swal('Success', 'The topic has been deleted', 'success');
            }).catch((error) => {
                console.log('Error deleting', error);
            })
        }
    }
    editTopic = () => {
        axios({
            method: 'PUT',
            url: 'api/topics',
            data: this.state.editingTopic
        }).then(() => {
            this.getLatestData();
            this.closeDialogue();
            swal('Success', 'The topic has been edited', 'success');
        }).catch((error) => {
            console.log('Error updating', error);
        })
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
    handleChangeFor = (event) => {
        this.setState({
            ...this.state,
            editingTopic: { ...this.state.editingTopic, topic: event.target.value }
        })
    }
    handleTermChange = (event, property) => {
        this.setState({
            ...this.state,
            [property]: event.target.value
        })
    }
    openDialogue = (topic) => {
        this.setState({
            ...this.state,
            open: true,
            editingTopic: topic
        });
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
                    <button className="save-button" onClick={() => this.saveTerm()}>Save</button>
                </div>}
                <div className="center breathing-room"><button onClick={() => this.openNewDialogue()}>Add new topic</button>
                    {!this.state.termEdit && <p onClick={() => this.setState({ ...this.state, termEdit: true })} className="cancel link">Edit term display dates</p>}</div>
                    {/* to do: filter results */}
                    <div className="flex-box col-11">
                     <select onChange={(event)=>this.handleTermChange(event, 'filter')} value={this.state.filter}>
                        <option value="">View All</option>
                        {this.state.categories.map((category, i) => {
                            return(
                                <option value={category} key={i}>{category}</option>
                            );
                        })}
                        </select><button className="save-button" onClick={()=>this.applyFilter()}>Filter</button>
                    </div>
                <div className="container">
                    <table>
                        <thead>
                            <tr>
                                <td>Topic</td>
                                <td>Category</td>
                                <td>Actions</td>
                            </tr>
                        </thead>
                        <tbody>
                            {/* if we aren't filtering, just map the state. */}
                            {this.state.filtered.length === 0 ? (this.state.topics.map((topic, i) => {
                                return (
                                    <tr key={i}>
                                        <td>{topic.topic}</td>
                                        <td>{topic.category}</td>
                                        <td><button onClick={() => this.openDialogue(topic)}>Edit</button><button onClick={() => this.deleteTopic(topic)}>Delete</button></td>
                                    </tr>
                                );
                            })) : (this.state.filtered.map((topic, i ) => {
                                return (
                                    <tr key={i}>
                                    <td>{topic.topic}</td>
                                    <td>{topic.category}</td>
                                    <td><button onClick={() => this.openDialogue(topic)}>Edit</button><button onClick={() => this.deleteTopic(topic)}>Delete</button></td>
                                </tr>
                                );
                            }))}
                        </tbody>
                    </table>
                </div>
                {/* edit an existing topic */}
                <Dialog open={this.state.open}>
                    <div className="dialog-form">
                        <DialogTitle>Enter topic information</DialogTitle>
                        <label>Topic: </label><Input value={this.state.editingTopic.topic} onChange={(event) => this.handleChangeFor(event)} />
                        <div className="flex-box">
                            <p className="cancel" onClick={() => this.closeDialogue()}>Cancel</p>
                            <button onClick={() => this.editTopic()}>Submit</button>
                        </div>

                    </div>
                </Dialog>
                {/* create a new topic */}
                <Dialog open={this.state.newDialog}>
                    <div className="dialog-form">
                        <DialogTitle>Enter topic information</DialogTitle>
                        <label>Topic: </label><Input value={this.state.newTopic} onChange={(event) => this.handleTermChange(event, 'newTopic')} />
                        <label>Category:</label><select value={this.state.category} onChange={(event)=>this.handleTermChange(event, 'category')}>
                            <option value="">---</option>
                            {this.state.categories.map((category, i) => {
                                return (
                                    <option key={i} value={category}>{category}</option>
                                );
                            })}
                        </select>
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