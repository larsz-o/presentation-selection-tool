import React, { Component } from 'react'; 

class TopicsTable extends Component {
    constructor(props){
        super(props);
        this.state = {
            open: false,
            editingTopic: ''
        }
    }
    deleteTopic = (topic) => {
        if (window.confirm(`Are you sure you want to delete ${topic.topic}?`)) {
            axios({
                method: 'DELETE',
                url: 'api/topics',
                data: topic
            }).then(() => {
                this.props.getLatestData();
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
            this.props.getLatestData();
            this.props.closeDialogue();
            swal('Success', 'The topic has been edited', 'success');
        }).catch((error) => {
            console.log('Error updating', error);
        })
    }
    handleChangeFor = (event) => {
        this.setState({
            ...this.state,
            editingTopic: { ...this.state.editingTopic, topic: event.target.value }
        })
    }
    openDialogue = (topic) => {
        this.setState({
            ...this.state,
            open: true,
            editingTopic: topic
        });
    }
    render(){
        return(
            <div>
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
                            {topics.map((topic, i) => {
                                return (
                                    <tr key={i}>
                                        <td>{this.props.topic.topic}</td>
                                        <td>{this.props.topic.category}</td>
                                        <td><button onClick={() => this.openDialogue(topic)}>Edit</button><button onClick={() => this.deleteTopic(this.props.topic)}>Delete</button></td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
                {/* edit an existing topic */}
                <Dialog open={this.state.open}>
                    <div className="dialog-form">
                        <DialogTitle>Enter topic information</DialogTitle>
                        <label>Topic: </label><Input value={this.state.editingTopic.topic} onChange={(event) => this.handleChangeFor(event)} />
                        <div className="flex-box">
                            <p className="cancel" onClick={() => this.props.closeDialogue()}>Cancel</p>
                            <button onClick={() => this.editTopic()}>Submit</button>
                        </div>

                    </div>
                </Dialog>
            </div>
        );
    }
}

export default TopicsTable;