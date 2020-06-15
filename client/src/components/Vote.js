import React from 'react'

class Vote extends React.Component{
	constructor(props) {
		super(props);
        this.state = {voting_end: false, voting_state: 0, agree: true, submit: false};
        this.handleClick = this.handleClick.bind(this);
    }
    
    handleClick(event) {
        const {name} = event.target
        if (name == "Agree") {
            this.setState({agree: true})
        }
        else if (name == "Disagree") {
            this.setState({agree: false})
        }
        this.setState({submit: true})
    }
    
    read_voting_state = async () => {
        const { accounts, contract } = this.props.data;
        let voting_state = await this.props.data.contract.methods.view_user_voting_state(accounts[0], this.props.title).call();
        //let voting_end = await this.props.data.contract.methods.view_project_voting_end(this.props.title).call();
        this.setState({voting_state: voting_state});
        //this.setState({voting_end: voting_end});
    }

    read_voting_end = async () => {
        const { accounts, contract } = this.props.data;
        let voting_end = await this.props.data.contract.methods.view_project_voting_end(this.props.title).call();
        this.setState({voting_end: voting_end});
    }

    start_voting = async () => {
        const { accounts, contract } = this.props.data;
        await contract.methods.start_voting(
			this.props.title,
			).send({
			from: accounts[0] ,
			value:0,
			gas:1000000,
			data:"0000"},function(error,hash){if(error){console.log(error);}})
    }

    stop_voting = async () => {
        const { accounts, contract } = this.props.data;
        await contract.methods.stop_voting(
			this.props.title,
			).send({
			from: accounts[0] ,
			value:0,
			gas:1000000,
			data:"0000"},function(error,hash){if(error){console.log(error);}})
    }

    user_voting = async () => {
        const { accounts, contract } = this.props.data;
        await contract.methods.user_voting(
            this.props.title,
            this.state.agree
			).send({
			from: accounts[0] ,
			value:0,
			gas:1000000,
			data:"0000"},function(error,hash){if(error){console.log(error);}})
    }



	render(){
        this.read_voting_state();
        // this.read_voting_end();
        // alert(this.state.voting_state)
        /*return(
            <div>{this.state.voting_state}</div>
        )*/
        const today = Date.now()
        /*if (this.state.voting_end){
            return (
                <div>This project is ended.</div>
            )
        }*/

        if (this.state.submit) {
            if (this.state.voting_state == 0) {
                this.start_voting()
            }
            else if (this.state.voting_state == 1) {
                this.user_voting()
            }
            else if (this.state.voting_state == 2) {
                this.stop_voting()
            }
            else if (this.state.voting_state == 3) {
                this.stop_voting()
            }
            this.setState({submit: false});
        }
		if (this.state.voting_state == 0) {
            
            if (today > this.props.deadline )
                return(
                    <div>
                        <div>Be the first one to start the voting event!</div>
                        <button name="Start" onClick={this.handleClick}>Start voting</button>
                    </div>
                )
            else{
                return(
                    <div></div>
                )
            }
        }
        else if (this.state.voting_state == 1) {
            return(
                <div>
                    <div>Agree to let the project continue.</div>
                    <button name="Agree" onClick={this.handleClick}>Agree</button>
                    <button name="Disagree" onClick={this.handleClick}>Disagree</button>
                </div>
            )
        }
        else if (this.state.voting_state == 2) {
            if (today > this.props.deadline)
                return(
                    <div>
                        <div> You voted agree.</div>
                        <div>Be the first one to stop the voting event!</div>
                        <button name="Stop" onClick={this.handleClick}>Stop voting</button>
                    </div>
                )
            else{
                return(
                    <div> You voted agree.</div>
                )
            }
        }
        else if (this.state.voting_state == 3) {
            if (today > this.props.deadline)
                return(
                    <div>
                        <div> You voted disagree.</div>
                        <div>Be the first one to stop the voting event!</div>
                        <button name="Stop" onClick={this.handleClick}>Stop voting</button>
                    </div>
                )
            else{
                return(
                    <div> You voted disagree.</div>
                )
            }
        }
        else if (this.state.voting_state == 4) {
            return(
                <div> This project succeeded.</div>
                    
            )
        }   
        else if (this.state.voting_state == 5) {
            return(
                <div> This project failed.</div>
                    
            )
        }   
        else {
            return(
                <div>
                    Error! {this.state.voting_state}
                </div>
            )
        }
	}
}

export default Vote;