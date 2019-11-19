import React, { Component } from 'react';
import Header from '../Header/Header';
import axios from 'axios';
import { Dialog, DialogTitle, Select, MenuItem, Input } from '@material-ui/core';
import swal from 'sweetalert';
import { Delete, Edit, Clear } from '@material-ui/icons';

let asc = true;
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
        if (this.state.filter !== '') {
            let filtered = topics.filter(topic => topic.category === this.state.filter);
            console.log(filtered);
            this.setState({
                ...this.state,
                filtered: filtered
            })
        } else {
            this.setState({
                ...this.state,
                filtered: topics
            })
        }
    }
    closeDialogue = () => {
        this.setState({
            ...this.state,
            open: false,
            newDialog: false,
            editCategory: true
        })
    }
    componentDidMount = () => {
        this.getLatestData();
        this.getActiveTerm();
    }
    deleteTopic = (topic) => {
        swal({
            title: `Are you sure you want to delete ${topic.topic}?`,
            text: "This action cannot be undone.",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        })
            .then((willDelete) => {
                if (willDelete) {
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
            });
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
            if (categories.indexOf(test) === -1) {
                categories.push(array[i].category)
            }
        }
        this.setState({
            ...this.state,
            categories: categories
        })
    }
    getLatestData = () => {
        console.log('getting latest data')
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
        let regEx = /^[A-Z a-z _][A-Z a-z 0-9 _]*$/
        if (regEx.test(this.state.category) && this.state.category.length < 64) {
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
        } else {
            swal('Uh-oh', 'Your category name can only contain numbers, letters, and underscores and it must be less than 64 characters. Please try again.', 'error');
        }
    }
    resetAll = () => {
        //when clicked, remove the student claims for all topics 
        swal({
            title: "Are you sure?",
            text: "Unclaiming all topics will remove all student data from each topic. This action cannot be undone. You will typically do this action at the beginning of a new term.",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        })
            .then((willDelete) => {
                if (willDelete) {
                    axios({
                        method: 'PUT',
                        url: `api/topics/reset/all`
                    }).then((response) => {
                        this.getLatestData();
                        swal("All topics have bene unclaimed!", {
                            icon: "success",
                        });
                    }).catch((error) => {
                        console.log('Error updating topics', error);
                    })
                } else {
                    swal("Success", "Alright, all data is safe!", 'success');
                }
            });
    }
    resetTopic = (topic) => {
        // when clicked, take this data and remove the student information from it 
        swal({
            title: "Are you sure?",
            text: `You are attempting to remove a student's data from ${topic.topic}. Is this what you wanted to do?`,
            icon: "warning",
            buttons: true,
            dangerMode: true,
        })
            .then((willDelete) => {
                if (willDelete) {
                    axios({
                        method: 'PUT',
                        url: `api/topics/reset?id=${topic.id}`
                    }).then((response) => {
                        this.getLatestData();
                        swal(`${topic.topic} has been unclaimed!`, {
                            icon: "success",
                        });
                    }).catch((error) => {
                        console.log('Error updating topics', error);
                    })
                } else {
                    swal("Success", "Alright, all data is safe!", 'success');
                }
            });


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
    sortData = () => {
        asc = !asc;
        if (this.state.filtered.length === 0) {
            let topics = this.state.topics;
            topics.sort(function (a, b) {
                let keyA = a.topic.toLowerCase();
                let keyB = b.topic.toLowerCase();
                // Compare the 2 dates
                //descending 
                if (asc === false) {
                    if (keyA > keyB) return -1;
                    if (keyA < keyB) return 1;
                    return 0;
                } else {
                    //acscending 
                    if (keyA < keyB) return -1;
                    if (keyA > keyB) return 1;
                    return 0;
                }
            });
            this.setState({
                ...this.state,
                topics: topics
            })
        } else {
            let topics = this.state.filtered;
            topics.sort(function (a, b) {
                //descending 
                let keyA = a.topic.toLowerCase();
                let keyB = b.topic.toLowerCase();
                // Compare the 2 dates
                //descending 
                if (asc === false) {
                    if (keyA > keyB) return -1;
                    if (keyA < keyB) return 1;
                    return 0;
                } else {
                    //acscending 
                    if (keyA < keyB) return -1;
                    if (keyA > keyB) return 1;
                    return 0;
                }
            });
            this.setState({
                ...this.state,
                filtered: topics
            })
        }
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
                <div className="flex-box-center">
                    <div className="breathing-room col-6"><p>Use this console to manage topics for student presentations. In the table below, you will see a list of all existing topics. If a topic has been claimed, the student's name will appear in the "Claimed by" column. The table can be sorted alphabetically by topic (by clicking the "Topics" heading) and filtered by category.</p>
                    <h4>Resetting data</h4><p>At the start of a new term, you should <span onClick={() => this.resetAll()} className="link">reset or "unclaim" all topics.</span> This will remove the student's name from the topic and allow you to reuse this tool from semester to semester. During the semester, you might find a need to remove a student from a topic (for instance, if they select the wrong one). Simply click the "X" icon next to the student's name to "unclaim" this specific topic.</p>
                    <h4>Managing topics</h4>
                       <p>You can <span onClick={() => this.openNewDialogue()} className="link">add a new topic</span> for students to choose. You can also edit or delete existing topics by clicking the appropriate icons in the table below.</p> 
                    <h4>Managing term dates</h4>
                    <p>Students will see the current term when they use the selection tool. You should  <span onClick={() => this.setState({ ...this.state, termEdit: true })} className="link">edit term display dates</span> at the beginning of each new term.</p>
                       </div>
                </div>
            <div className="flex-box-center">
            {this.state.termEdit && <div className="term-select">
                    <label>Term:</label>
                    <Select
                        value={this.state.term}
                        onChange={(event) => this.handleTermChange(event, 'term')}>
                        <MenuItem value={'Fall-1'}>Fall-1</MenuItem>
                        <MenuItem value={'Fall-2'}>Fall-2</MenuItem>
                        <MenuItem value={'Spring-1'}>Spring-1</MenuItem>
                        <MenuItem value={'Spring-2'}>Spring-2</MenuItem>
                    </Select>
                    <label>Year:</label><Input onChange={(event) => this.handleTermChange(event, 'year')} />
                    <button className="save-button" onClick={() => this.saveTerm()}>Save</button>
                    <span className="cancel" onClick={() => this.setState({ ...this.state, termEdit: false })}>cancel</span>
                </div>}
            </div>
                <div className="flex-box col-11">
                    <select onChange={(event) => this.handleTermChange(event, 'filter')} value={this.state.filter}>
                        <option value="">View All</option>
                        {this.state.categories.map((category, i) => {
                            return (
                                <option value={category} key={i}>{category}</option>
                            );
                        })}
                    </select><button className="save-button" onClick={() => this.applyFilter()}>Apply Filter</button>
                </div>
                <div className="container">
                    <table>
                        <thead>
                            <tr>
                                <td onClick={() => this.sortData()} className="cancel link">Topic</td>
                                <td>Category</td>
                                <td>Claimed by</td>
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
                                        <td className="flex-start">{topic.student} {topic.student !== null &&
                                            <div>{topic.student.length >= 1 && <Clear className="icon" onClick={() => this.resetTopic(topic)} />}</div>}</td>
                                        <td><Edit className="icon" onClick={() => this.openDialogue(topic)} /><Delete className="icon" onClick={() => this.deleteTopic(topic)} /></td>
                                    </tr>
                                );
                            })) : (this.state.filtered.map((topic, i) => {
                                return (
                                    <tr key={i}>
                                        <td>{topic.topic}</td>
                                        <td>{topic.category}</td>
                                        <td className="flex-start">{topic.student} {topic.student !== null &&
                                            <div>{topic.student.length >= 1 && <Clear className="icon" onClick={() => this.resetTopic(topic)} />}</div>}</td>
                                        <td><Edit className="icon" onClick={() => this.openDialogue(topic)} /><Delete className="icon" onClick={() => this.deleteTopic(topic)} /></td>
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
                        <label>Category:</label><select value={this.state.category} onChange={(event) => this.handleTermChange(event, 'category')}>
                            <option value="">---</option>
                            {this.state.categories.map((category, i) => {
                                return (
                                    <option key={i} value={category}>{category}</option>
                                );
                            })}
                        </select>
                        {this.state.editCategory ? (<p className="cancel link" onClick={() => this.toggleEdit()}>Category not listed?</p>) : (<div><p>Create a new category: </p><Input onChange={(event) => this.handleTermChange(event, 'category')} /></div>)}
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