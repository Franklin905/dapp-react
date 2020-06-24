import React from 'react'

class Vote extends React.Component{
	constructor(props) {
		super(props);
        this.state = {success: false, wait_change: false, init: true, end: false, isvoting: false, voting_state: 0, agree: true, submit: false};
        this.handleClick = this.handleClick.bind(this);
        this.readClick = this.readClick.bind(this);
        this.agreeClick = this.agreeClick.bind(this);
        this.disagreeClick = this.disagreeClick.bind(this);
    }
    readClick(event){
        this.read_state();
        this.setState({wait_change: false});
    }
    agreeClick(){
        this.vote_agree();
        this.setState({wait_change: true});
        //this.read_state();
    }
    disagreeClick(){
        this.vote_disagree();
        this.setState({wait_change: true});
        //this.read_state();
    }
    handleClick(event){
        const {name} = event.target
        if (name == "Agree") {
            this.setState({agree: true})
        }
        else if (name == "Disagree") {
            this.setState({agree: false})
        }
        
        if (this.state.isvoting == false) {
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
        else if (this.state.isvoting == true) {
            this.stop_voting()
        }
        else{
            console.log("submit error");
        }
        this.setState({wait_change: true});
        //this.read_state();
        //console.log("Click end");
    }
    
    read_state = async () => {
        const { accounts, contract } = this.props.data;
        let temp = await this.props.data.contract.methods.view_read_state(this.props.title).call();
        this.setState({voting_state: temp[0]});
        this.setState({end: temp[1]});
        this.setState({isvoting: temp[2]});
        this.setState({success: temp[3]});
        //console.log("read end");
    }
    /*read_voting_state = async () => {
        const { accounts, contract } = this.props.data;
        let voting_state = await this.props.data.contract.methods.view_user_voting_state(accounts[0], this.props.title).call();
        //let voting_end = await this.props.data.contract.methods.view_project_voting_end(this.props.title).call();
        this.setState({voting_state: voting_state});
        //this.setState({voting_end: voting_end});
    }

    read_end = async () => {
        const { accounts, contract } = this.props.data;
        let end = await this.props.data.contract.methods.view_project_end(this.props.title).call();
        this.setState({end: end});
    }

    read_isvoting = async () => {
        const { accounts, contract } = this.props.data;
        let isvoting = await this.props.data.contract.methods.start_voting_or_not(this.props.title).call();
        this.setState({isvoting: isvoting});
    }*/

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
    vote_agree = async () => {
        const { accounts, contract } = this.props.data;
        await contract.methods.user_voting(
            this.props.title,
            true
            ).send({
            from: accounts[0] ,
            value:0,
            gas:1000000,
            data:"0000"},function(error,hash){if(error){console.log(error);}})
    }
    vote_disagree = async () => {
        const { accounts, contract } = this.props.data;
        await contract.methods.user_voting(
            this.props.title,
            false
            ).send({
            from: accounts[0] ,
            value:0,
            gas:1000000,
            data:"0000"},function(error,hash){if(error){console.log(error);}})
    }


	render() {
        //console.log("render start");
        //this.read_state();
        /*
        this.read_voting_state();
        this.read_isvoting();
        this.read_end();
        */
       /*
        if(this.state.wait_change == true){
            let temp1 = this.state.isvoting;
            let temp2 = this.state.end;
            let temp3 = this.state.voting_state;
            this.read_state();
            if(temp1 != this.state.isvoting || temp2 != this.state.end || temp3 != this.state.voting_state){
                this.setState({wait_change: false});
                console.log("read change");
            }
        }*/
        if(this.state.init){
            this.read_state();
            this.setState({init: false});
        }
        if(this.state.wait_change){
            //<div>load again</div>
            return(
                <button name="Reload" class="VotingButton" onClick={this.readClick}>load again</button>
            )
        }
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


        if (this.state.end && this.state.success) {
            return(
                <p class="BasicWord"> This project succeeded.</p>
            )
        }   
        else if (this.state.end && !this.state.success) {
            return(
                <p class="BasicWord"> This project failed.</p>
            )
        }
		else if (this.state.isvoting == false) {
            
            if (today > this.props.deadline )
                return(
                    <div>
                        <p class="BasicWord">Be the first one to start the voting event!</p>
                        <button name="Start" class="VotingButton" onClick={this.handleClick}>Start voting</button>
                    </div>
                )
            else{
                return(
                    <p class="NotStart">Voting event hasn't start yet.</p>
                )
            }
        }
        else if (this.state.voting_state == 1) {
            return(
                <div>
                    <p class="BasicWord">Agree to let the project continue.</p>
                    <button class="VotingButton" name="Agree" onClick={this.agreeClick}>Agree</button>
                    <button class="VotingButton" name="Disagree" onClick={this.disagreeClick}>Disagree</button>
                </div>
            )
        }
        else if (this.state.voting_state == 2) {
            if (today > this.props.deadline)
                return(
                    <div>
                        <p class="BasicWord"> You voted agree.</p>
                        <p class="BasicWord">Be the first one to stop the voting event!</p>
                        <button class="VotingButton" name="Stop" onClick={this.handleClick}>Stop voting</button>
                    </div>
                )
            else{
                return(
                    <p class="BasicWord"> You voted agree.</p>
                )
            }
        }
        else if (this.state.voting_state == 3) {
            if (today > this.props.deadline)
                return(
                    <div>
                        <p class="BasicWord"> You voted disagree.</p>
                        <p class="BasicWord">Be the first one to stop the voting event!</p>
                        <button class="VotingButton" name="Stop" onClick={this.handleClick}>Stop voting</button>
                    </div>
                )
            else{
                return(
                    <p class="BasicWord"> You voted disagree.</p>
                )
            }
        }
        else if (this.state.isvoting == true) {
            
            if (today > this.props.deadline )
                return(
                    <div>
                        <p class="BasicWord">Be the first one to stop the voting event!</p>
                        <button class="VotingButton" name="Stop" onClick={this.handleClick}>Stop voting</button>
                    </div>
                )
            else{
                return(
                    <p class="BasicWord">Error! {this.state.voting_state}</p>
                )
            }
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