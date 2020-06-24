import React, { Component } from "react"

class CreateProject extends Component {
	//state = {title: '', intro: '', topic: '', tar_money: "1", deadline: '', submit: false, hasCreate: false}
	constructor(props) {
		super(props);
		this.state = {title: '', topic: '', intro: '', tar_money: "1", deadline: '',stagenum: 1 ,submit: false, hasCreate: false}

		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleTopic = this.handleTopic.bind(this);
	}

	handleSubmit() {
		this.setState({submit: true})
	}

	handleChange(event) {
		const {name, value} = event.target
		this.setState({[name]: value})
	}

	handleTopic(event) {
		this.setState({topic: event.target.value});
	}

	Catch_error = async () => {
		try{
			await this.add_project();
		} catch(error) {
			alert('Error occurs : The project name has been used.');
		}
	}

	add_project = async () => {
		const { accounts, contract } = this.props.data;
		await contract.methods.add_project(
			this.state.title,
			this.state.topic,
			this.state.intro,
			this.props.data.web3.utils.toWei(this.state.tar_money,"ether"),
			Date.parse(this.state.deadline) / 1000,
			this.state.stagenum,
			).send({
			from: accounts[0],
			value:0,
			gas:1000000,
			data:"0000"},function(error,hash){if(error){console.log(error);}})
	 }

	render() {
		if (this.state.submit) {
			if (!this.state.hasCreate) {
				this.Catch_error();
				console.log('In render, here.');
				//this.add_project();
				this.setState({hasCreate: true});
			}
			return (
				<div class="Center">
					<h1>Adding Transaction</h1>
					<br></br>
					<button className="Button" name="view project" onClick={this.props.handleCurrentPage}>View project</button>
				</div>
			)
		}
		return (
			<div class="Center">
				<h1 class="h1">Create project</h1>
				<form name="view project" onSubmit={this.handleSubmit}>
					<h3 class="h2">Project Title</h3>
					<input
						name="title"
						value={this.state.title}
						type="text"
						placeholder="Project Title..."
						onChange={this.handleChange}
						style={{fontSize: "16px",
							fontFamily: "'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif, Microsoft JhengHei"}}>
					</input>
					<br></br>
					<h3 class="h2">Project Topic</h3>
					<label>
						<select name='topic' value={this.state.topic} onChange={this.handleChange}>
							<option value="select">-select-</option>
							<option value="charity">Charity</option>
							<option value="environment">Environment</option>
							<option value="innovations">Innovations</option>
							<option value="activities">Activities</option>
							<option value="animals">Animals</option>
							<option value="others">Others</option>
						</select>
					</label>
					<br></br>
					<h3 class="h2">Project Introduction</h3>
					<textarea
						name="intro"
						value={this.state.intro}
						placeholder="Project Introduction..."
						onChange={this.handleChange}
						style={{width: "300px",
							height: "150px",
							fontFamily: "'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif, Microsoft JhengHei",
							fontSize: "16px"}}>
					</textarea>
					<br></br>
					<h3 class="h2">Target Money</h3>
					<input
						name="tar_money"
						value={this.state.tar_money}
						type="number"
						placeholder="Target Money"
						min="1"
						onChange={this.handleChange}>
					</input>
					<br></br>
					<h3 class="h2">Stage Number</h3>
					<input
						name="stagenum"
						value={this.state.stagenum}
						type="number"
						placeholder="Stage Number"
						min="1"
						onChange={this.handleChange}>
					</input>
					<br></br>
					<h3 class="h2">Deadline</h3>
					<br></br>
					<input
						name="deadline"
						value={this.state.deadline}
						type="datetime-local"
						placeholder="Deadline"
						onChange={this.handleChange}>
					</input>
					<br></br>
					<button className="Button">Submit</button>
				</form>
			</div>
		)
	}
}

export default CreateProject