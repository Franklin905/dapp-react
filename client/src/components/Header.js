import React, { Component } from "react"

class Header extends Component {

    render() {
        if (this.props.hasRegister){
            const { accounts, contract } = this.props.data;
            if (this.props.nickname != ''){
                return (
                    <div className="Header">
                        <div class="HeaderLeftBlock">
                            <button name="menu" className="Logo" onClick={this.props.handleCurrentPage}><h1>DCrowdfunding</h1></button>
                            <button className="HeaderButton" name="create project" onClick={this.props.handleCurrentPage}>Create project</button>
                            <button className="HeaderButton" name="view project" onClick={this.props.handleCurrentPage}>View project</button>
                        </div>
                        <div class="HeaderLeftBlock">
                            <span className="HeaderRight"></span>
                            <button className="HeaderButton" name={accounts[0]} onClick={this.props.handleWhosePage}>About {this.props.nickname}</button>
                        </div>
                        
                    </div>
                )
            }
            else{
                return (
                    <div className="Header">
                        <div class="HeaderLeftBlock">
                            <button name="menu" className="Logo" onClick={this.props.handleCurrentPage}><h1>DCrowdfunding</h1></button>
                            <button className="HeaderButton" name="create project" onClick={this.props.handleCurrentPage}>Create project</button>
                            <button className="HeaderButton" name="view project" onClick={this.props.handleCurrentPage}>View project</button>
                        </div>
                        <div class="HeaderRightBlock">
                            <span className="HeaderRight"></span>
                            <button className="HeaderButton" name={accounts[0]} onClick={this.props.handleWhosePage}>About user</button>
                        </div>
                    </div>
                )
            }
        }
        else{
            return (
                <div className="Header">
                    <button name="menu" className="Logo" onClick={this.props.handleCurrentPage}><h1>DCrowdfunding</h1></button>
                    <button className="HeaderButton" name="create project" onClick={this.props.handleCurrentPage}>Create project</button>
                    <button className="HeaderButton" name="view project" onClick={this.props.handleCurrentPage}>View project</button>
                    <span className="HeaderRight"></span>
                    <button className="HelloButton" name="register" onClick={this.props.handleCurrentPage}>Register</button>
                </div>
            )
        }
    }
}

export default Header