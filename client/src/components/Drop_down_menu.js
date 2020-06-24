import React from "react"

// 下拉式選單 (Main concepts - Forms)
/*
class DropDownMenu extends React.Component {
	constructor(props) {
		super(props);
		this.state = {value: 'select'};

		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	handleChange(event) {
		this.setState({value: event.target.value});
	}

	handleSubmit(event) {
		//alert('Fundraising topics: ' + this.state.value);		//remove(?)
		event.preventDefault();
	}

	render() {
		return (
			<form onSubmit={this.handleSubmit}>
				<label>
					Fundraising topics:
					<select value={this.state.value} onChange={this.handleChange}>
						<option value="select">-select-</option>
						<option value="charity">Charity</option>
						<option value="environment">Environment</option>
						<option value="innovations">Innovations</option>
						<option value="activities">Activities</option>
						<option value="animals">Animals</option>
						<option value="others">Others</option>
					</select>
				</label>
				<input type="submit" value="Submit" />
			</form>
		);
	}
}
*/

function DropDownMenu(props){
	return (
		<form>
			<label class="BasicWords">
				<div>Fundraising topics:</div>
				<select value={props.value} onChange={props.handleChange}>
					<option value="select">-select-</option>
					<option value="charity">Charity</option>
					<option value="environment">Environment</option>
					<option value="innovations">Innovations</option>
					<option value="activities">Activities</option>
					<option value="animals">Animals</option>
					<option value="others">Others</option>
				</select>
			</label>
		</form>
	);
}
export default DropDownMenu;