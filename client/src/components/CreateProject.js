import React, { Component } from "react"

class CreateProject extends Component {
	//state = {title: '', intro: '', topic: '', tar_money: "1", deadline: '', submit: false, hasCreate: false}
	constructor(props) {
		super(props);
		this.state = {title: '', topic: '', intro: '', tar_money: "1", deadline: '', submit: false, hasCreate: false, 'title_exist': false}

		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);		// 2020/06/18
		this.handleTopic = this.handleTopic.bind(this);
	}

	handleChange(event) {
		const {name, value} = event.target;
		this.setState({[name]: value});
	}

	handleTopic(event) {
		this.setState({topic: event.target.value});
	}

	// 2020/06/18
	handleSubmit() {
		/*await this.check_title();
		if(this.state.title_exist) {
			console.log(this.state.title_exist);
			console.log('title already exists!');
		}
		else{
			console.log(this.state.title_exist);
			console.log('title pass');
			this.setState({submit: true});
		}*/
		this.setState({submit: true});
	}

	// 2020/06/18
	check_title = async () => {
		const title_check = await this.props.data.contract.methods.check_title(this.state.title).call();
		await this.setState({title_exist: title_check});
	}

	add_project = async () => {
		const { accounts, contract } = this.props.data;
		await contract.methods.add_project(
			this.state.title,
			this.state.topic,
			this.state.intro,
			this.props.data.web3.utils.toWei(this.state.tar_money,"ether"),
			Date.parse(this.state.deadline) / 1000,
			).send({
			from: accounts[0],
			value:0,
			gas:1000000,
			data:"0000"},function(error,hash){if(error){console.log(error);}})
	 }

	render() {
		if (this.state.submit) {
			this.check_title();
			if (this.state.title_exist) {
				alert('title already exists!');
				this.setState({submit: false});
			}
			else {
				console.log('this.state.title_exist = ' + this.state.title_exist);
				if (!this.state.hasCreate) {
					this.add_project();
					this.setState({hasCreate: true});
				}
				return (
					<div>
						<h1>Adding Transaction</h1>
						<br></br>
						<button className="Button" name="view project" onClick={this.props.handleCurrentPage}>View project</button>
					</div>
				)
			}
		}
		return (
			<div>
				<h1>Create project</h1>
				<form name="view project" onSubmit={this.handleSubmit}>
					<h3 style={{marginBottom: "5px"}}>Project Title</h3>
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
					<h3 style={{marginBottom: "5px"}}>Project Topic</h3>
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
					<h3 style={{marginBottom: "5px"}}>Project Introduction</h3>
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
					<h3 style={{marginBottom: "5px"}}>Target Money</h3>
					<input
						name="tar_money"
						value={this.state.tar_money}
						type="number"
						placeholder="Target Money"
						min="1"
						onChange={this.handleChange}>
					</input>
					<br></br>
					<h3 style={{marginBottom: "5px"}}>Deadline</h3>
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