import React, { Component } from "react"

class Header extends Component {

    render() {
        return (
            <div>
                <button name="menu" className="Logo" onClick={this.props.handleCurrentPage}><h1>DCrowdfunding</h1></button>
                <button className="HeaderButton" name="create project" onClick={this.props.handleCurrentPage}>Create project</button>
                <button className="HeaderButton" name="view project" onClick={this.props.handleCurrentPage}>View project</button>
                <button className="HeaderButton" name="register" onClick={this.props.handleCurrentPage}>Register</button>
                <hr></hr>
            </div>
        )
    }
}

export default Header