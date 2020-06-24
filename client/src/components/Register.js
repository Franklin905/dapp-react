import React, { Component } from "react"

class Register extends Component {
	constructor(props) {
		super(props);
		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		//this.state = {intro: '', nickname: '', submit: false, hasRegister: false};
		this.state = {intro: '', nickname: '', submit: false};
	}
	handleChange(event) {
		const {name, value} = event.target;
		this.setState({[name]: value});
	}
	handleSubmit(event) {
		this.setState({submit: true});
		// alert('Registered!');
	}
	register = async () => {
		const { accounts, contract } = this.props.data;
		await contract.methods.add_user(this.props.nickname,this.state.intro)
		.send({
			from: accounts[0] ,
			value:0,
			gas:1000000,
			data:"0000"},function(error,hash){if(error){console.log(error);}
		})
	}

	render() {
		if(this.state.submit) {
			if(!this.props.hasRegister) {
				this.register();
				this.props.handleRegister()
			}
			return (
				<div class="Center">
					<h1 class="h1">Register Successfully!</h1>
					<br></br>
					<button class="Button" className="Button" name="menu" onClick={this.props.handleCurrentPage}>Menu</button>
				</div>
			)
		}
		return(
			<div class="Center">
				<form onSubmit={this.handleSubmit} class="Center">
					<fieldset class="RegisterField">
						<legend class="RegisterLegend">Welcome to DCrowdfunding</legend>
						<p class="BasicWord">Nickname: 
							<input maxlength="12" name="nickname" type='text' class="NicknameInput" value={this.props.nickname} onChange={this.props.handleNickname} />
						</p>

						<textarea
							name="intro"
							value={this.state.intro}
							placeholder="Introduce yourself..."
							onChange={this.handleChange}
							class="IntroductionInput">
						</textarea>
						<br></br>
						<input class="Button" type="submit" value="Submit" />
					</fieldset>
				</form>
			</div>
		);
	}
}

export default Register