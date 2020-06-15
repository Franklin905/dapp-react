import React, { Component } from "react"

class Register extends Component {
	constructor(props) {
		super(props);
		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.state = {intro: '', nickname: '', submit: false, hasRegister: false};
	}
	handleChange(event) {
		const {name, value} = event.target;
		this.setState({[name]: value});
	}
	handleSubmit(event) {
		this.setState({submit: true});
		alert('Registered!');
	}
	register = async () => {
		const { accounts, contract } = this.props.data;
		await contract.methods.add_user(this.state.nickname,this.state.intro)
		.send({
			from: accounts[0] ,
			value:0,
			gas:1000000,
			data:"0000"},function(error,hash){if(error){console.log(error);}
		})
	}

	render() {
		if(this.state.submit) {
			if(!this.state.hasRegister) {
				this.register()
				this.setState({hasRegister: true})
			}
			return (
				<div>
					<h1>Register Successfully!</h1>
					<br></br>
					<button className="Button" name="menu" onClick={this.props.handleCurrentPage}>Menu</button>
				</div>
			)
		}
		return(
			<div>
				<h1 style={{color:'whiter', textAlign:'center'}}>Welcome to DCrowdfunding</h1>
				<form onSubmit={this.handleSubmit}>
					<fieldset style={{background:' #eeeeee', marginTop:'20px', width:'1200px'}}>
						<legend style={{background: 'gray', color: 'white', padding: '5px 10px'}}>Register</legend>
						<label style={{color:'black'}}>
							Nickname:
							<input name="nickname" type='text' value={this.state.nickname} onChange={this.handleChange} />
						</label>

						<textarea
							name="intro"
							value={this.state.intro}
							placeholder="Introduce yourself..."
							onChange={this.handleChange}
							style={{width: "1200px",
								height: "150px",
								display: 'table-cell',
								fontFamily: "'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif, Microsoft JhengHei",
								fontSize: "16px"}}>
						</textarea>
						<input style={{color:'blue', marginLeft:'600px', marginBottom:'10px'}} type="submit" value="Submit" />
					</fieldset>
				</form>
			</div>
		);
	}
}

export default Register