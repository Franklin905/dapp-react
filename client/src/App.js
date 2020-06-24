import React, { Component } from "react";
import FundContract from "./contracts/Fund.json";
import getWeb3 from "./getWeb3";

import Header from "./components/Header"
import Menu from "./components/Menu"
import CreateProject from "./components/CreateProject"
import ViewProject from "./components/ViewProject"
import Register from "./components/Register"
import PersonalPage from "./components/PersonalPage"

import "./App.css";

class App extends Component {
  state = {render_list:[], web3: null, accounts: null, contract: null, current_page: "menu", hasRegister: false, nickname:'', whose_page: ''};
  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = FundContract.networks[networkId];
      const instance = new web3.eth.Contract(
        FundContract.abi,
        deployedNetwork && deployedNetwork.address,
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: instance }, this.runExample);
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  handleCurrentPage = (event) => {
    const {name} = event.target
    this.setState({current_page: name})
  }

  handleRegister = (event) => {
    this.setState({hasRegister: true});
  }

  handleNickname = (event) => {
    const {name, value} = event.target;
    this.setState({[name]: value});
  }

  handleWhosePage = (event) => {
    const {name} = event.target;
    this.setState({whose_page: name, current_page: 'personal page'});
  }

  render(){
    if (!this.state.web3) {
      return <div className="App">Loading Web3, accounts, and contract...</div>;
    }
    if (this.state.current_page === "menu") {
      return (
        <div className="Background">
          <div><Header handleCurrentPage = {this.handleCurrentPage} handleWhosePage = {this.handleWhosePage} hasRegister = {this.state.hasRegister} nickname = {this.state.nickname} data = {this.state} /></div>
          <div className="App">
            <Menu
              data={this.state}
              handleCurrentPage = {this.handleCurrentPage}
            />
          </div>
        </div>
      )
    }
    else if (this.state.current_page === "create project") {
      return (
        <div className="Background">
          <div><Header handleCurrentPage = {this.handleCurrentPage} handleWhosePage = {this.handleWhosePage} hasRegister = {this.state.hasRegister} nickname = {this.state.nickname} data = {this.state} /></div>
          <div className="App">
            <CreateProject 
              data={this.state}
              handleCurrentPage = {this.handleCurrentPage}
            />
          </div>
        </div>
        
      )
    }
    else if (this.state.current_page === "view project") {
      return (
        <div className="Background">
          <div><Header handleCurrentPage = {this.handleCurrentPage} handleWhosePage = {this.handleWhosePage} hasRegister = {this.state.hasRegister} nickname = {this.state.nickname} data = {this.state} /></div>
          <div className="App">
            <ViewProject 
              data={this.state}
              handleCurrentPage = {this.handleCurrentPage}
              handleWhosePage = {this.handleWhosePage}
              whose_page = {this.state.whose_page}
            />
          </div>
        </div>
      )
    }
    else if (this.state.current_page === "register") {
      return (
        <div className="Background">
          <div><Header handleCurrentPage = {this.handleCurrentPage} handleWhosePage = {this.handleWhosePage} hasRegister = {this.state.hasRegister} nickname = {this.state.nickname} data = {this.state} /></div>
          <div className="App">
            <Register 
              data={this.state}
              handleCurrentPage = {this.handleCurrentPage}
              handleRegister = {this.handleRegister}
              handleNickname = {this.handleNickname}
              hasRegister = {this.state.hasRegister}
              nickname = {this.state.nickname}
            />
          </div>
        </div>
      )
    }
    else if (this.state.current_page === "personal page") {
      return (
        <div className="Background">
          <div><Header handleCurrentPage = {this.handleCurrentPage} handleWhosePage = {this.handleWhosePage} hasRegister = {this.state.hasRegister} nickname = {this.state.nickname} data = {this.state} /></div>
          <div className="App">
            <PersonalPage 
              data={this.state}
              handleCurrentPage = {this.handleCurrentPage}
              whose_page = {this.state.whose_page}
            />
          </div>
        </div>
      )
    }
    else{
      return (
        <div className="Background">
          <div><Header handleCurrentPage = {this.handleCurrentPage} handleWhosePage = {this.handleWhosePage} hasRegister = {this.state.hasRegister} nickname = {this.state.nickname} data = {this.state} /></div>
          <div className="App">
            <Menu
              data={this.state}
              handleCurrentPage = {this.handleCurrentPage}
            />
          </div>
        </div>
      )
    }
  }
}

export default App;
