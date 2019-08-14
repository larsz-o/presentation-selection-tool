import React, { Component } from 'react';

class Header extends Component {
    render() {
        return (
            <div>
                <div className="logo">
                    <img src={require('../StudentView/logo.png')} alt="Brandeis logo" width="100%" />
                   {this.props.term.length > 0 && <h2>RBIF 102: {this.props.term[0].semester} {this.props.term[0].year}</h2>} 
                </div>
            </div>

        );
    }
}
export default Header;