import React, { Component } from "react"

class Sponsor extends Component {
    state = {money: "1", submit: false, hasSponsor: false}

    handleSubmit = (event) => {
        this.setState({submit: true})
    }

    handleChange = (event) => {
        const {name, value} = event.target
        this.setState({[name]: value})
    }

    sponsor_project = async () => {
        const { accounts, contract } = this.props.data;
        await contract.methods.recieve_value_to_project(this.props.project_data[0]).send({
            from: accounts[0],
            value: this.props.data.web3.utils.toWei(this.state.money,"ether"), 
            gas:1000000,
            data:"0000"},function(error,hash){if(error){console.log(error);}});
    }

    render() {
        if (this.state.submit) {
            if (!this.state.hasSponsor) {
                this.sponsor_project()
                this.setState({hasSponsor: true})
            }
            return (
                <div class="Center">
                    <h1>Adding Transaction</h1>
                    <br></br>
                    <button className="Button" name={this.props.current_project} onClick={this.props.handleCurrentProject}>Back to project</button>
                </div>
            )
        }
        return (
            <div class="Center">
                <h1 class="h1">Sponsor</h1>
                <button name={this.props.current_project} className="Button" onClick={this.props.handleCurrentProject}>Back to project</button>
                <form name="view project" onSubmit={this.handleSubmit}>
                    <h2 class="BasicWord">Sponsor Money Amount</h2>
                    <input
                        name="money"
                        value={this.state.money}
                        type="number"
                        placeHolder="Sponsor Money Amount"
                        min="1"
                        onChange={this.handleChange}>
                    </input>
                    <br></br>
                    <button className="Button">Submit</button>
                </form>
            </div>
        )
    }
}

export default Sponsor