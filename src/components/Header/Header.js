import React, { Component } from 'react';

class Header extends Component {
    constructor(props){
        super(props);
        this.state = {
            term: ''
        }
    }
    render() {
        return (
            <div>
                <div className="logo">
                    <img src={require('../StudentView/logo.png')} alt="Brandeis logo" width="100%" />
                    <h2>RBIF 102: {this.state.term}</h2>
                </div>
            </div>

        );
    }
}
export default Header;