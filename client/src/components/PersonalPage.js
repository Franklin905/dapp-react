import React from 'react'

function Project(props) {
	let divStyle={marginBottom:20, backgroundColor:'#C3E0F9', width:'500px', height:'60px'}
	let messageStyle={color:'black', textAlign:'left'}
	return(
		<ul style={{display: 'flex',  justifyContent:'center', alignItems:'center'}}>{props.name}</ul>
	)
}

function ProjectBlock(props) {
	let message = props.projectData.map((item)=>{
			return <Project key={item.id} name={item.name}/>
	})
	return (
		<div>
			{message}
		</div>
	)
}

/*
// can't handle invalid address version
class PersonalPage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {submit: 0, whose_page:'', nickname:'', intro:'', created_project: [], user_exist:false};
		//this.state = {submit:false, whose_page:'', nickname:'Frank', intro:'I\'m a student in NTUEE. I like to play volleyball.', created_project: [{id:1, name:'Hello'}, {id:2, name:'CNN'}, {id:3, name:'ML'}]};
		
		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleBackwards = this.handleBackwards.bind(this);
	}
	
	get_personal_data = async () => {
		let list = [];
		let user_exist = 2;
		const whose_page = this.state.whose_page;
		try {
			user_exist = await this.props.data.contract.methods.view_user_exist_or_not(whose_page).call();
		} catch(error) {
			alert('Error Message: ' + error);
		}
		//const user_exist = await this.props.data.contract.methods.view_user_exist_or_not(whose_page).call();
		console.log('user_exist = ' + user_exist);
		//console.log('whose_page = ' + this.state.whose_page);
		//const personal_data = await this.props.data.contract.methods.view_user_data(whose_page).call();		//address?
		//console.log("personal_data[2] = " + personal_data[2]);
		if (user_exist == 1) {
			const personal_data = await this.props.data.contract.methods.view_user_data(whose_page).call();		//address?
			for(let i = 0; i < personal_data[2]; i++){
				let project = await this.props.data.contract.methods.view_user_created_project(whose_page, i).call();
				list.push({id:i+1, name:project});
			}
			this.setState({nickname: personal_data[0], intro: personal_data[1], created_project: list});
		}
		else if (user_exist == 0){
			this.setState({nickname: '', intro: '', created_project: []});
		}
	}

	handleChange(event) {
		const {name, value} = event.target;
		this.setState({[name]: value});
	}
	handleSubmit(event) {
		this.setState({submit: 1});
		alert('Search for ' + this.state.whose_page + '\'s personal page');
	}
    handleBackwards(event) {
    	this.setState({submit: 0, whose_page: ''});
    }

    render() {
    	let submit = this.state.submit;
    	if(submit === 0){
    		return(
    			<form>
	    			<label style={{color:'black'}}>
						Address:
						<input name="whose_page" type='text' value={this.state.whose_page} onChange={this.handleChange} />
					</label>
					<button name="submit" onClick={this.handleSubmit}>Search</button>
				</form>
    		)
    	}
    	else if (submit === 1){
    		this.get_personal_data();
	    	return(
	    		<div>
		    		<div>
		    			<h1 style={{textAlign: 'center', color: '#79D2C5', fontWeight: 'bold', fontSize:'60px'}}>{this.state.nickname}</h1>
		    			<hr style={{color: 'black', height: '5px'}}/>
		    			<h3 style={{textAlign: 'center'}}>About {this.state.nickname}</h3>
		    			<p style={{textAlign: 'center'}}>{this.state.intro}</p>
		    		</div>
		    		<div style={{marginTop:'100px'}}>
		    			<h2 style={{backgroundColor:'black', textAlign: 'center', color: '#79D2C5', fontWeight: 'bold', fontSize:'45px'}}>project list</h2>
		    			<ProjectBlock projectData={this.state.created_project} />
		    		</div>
		    		<button name="menu" onClick={this.props.handleCurrentPage}>Back to Menu</button>
		    		<br></br>
		    		<button name="submit" onClick={this.handleBackwards}>Search again</button>
	    		</div>
	    	)
	    }
    }
}
*/

// Without search function, only render personal page
class PersonalPage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {nickname:'', intro:'', created_project: [], user_exist:false};
	}
	
	get_personal_data = async () => {
		let list = [];
		let user_exist = 2;
		const whose_page = this.props.whose_page;
		try {
			user_exist = await this.props.data.contract.methods.view_user_exist_or_not(whose_page).call();
		} catch(error) {
			alert('Error Message: ' + error);
		}
		//console.log('whose_page = ' + this.props.whose_page);
		//console.log('user_exist = ' + user_exist);
		if (user_exist == 1) {
			const personal_data = await this.props.data.contract.methods.view_user_data(whose_page).call();		//address?
			for(let i = 0; i < personal_data[2]; i++){
				let project = await this.props.data.contract.methods.view_user_created_project(whose_page, i).call();
				list.push({id:i+1, name:project});
			}
			this.setState({nickname: personal_data[0], intro: personal_data[1], created_project: list});
		}
		else if (user_exist == 0){
			this.setState({nickname: '', intro: '', created_project: []});
		}
	}

    render() {
		this.get_personal_data();
		const nickname = this.state.nickname;
		let message = this.state.created_project.map((item)=>{
			const name = item.name;
			return(
				<div class="PersnalProject">{name}</div>
			)
		})
		if (nickname == ''){
			return(
	    		<div class="Center">
		    		<div>
		    			<h1 class="PersonalPageName"></h1>
		    			<p class="PersonalIntroduction">{this.state.intro}</p>
		    		</div>
		    		<div style={{marginTop:'100px'}}>
		    			<h2 class="h1">project list</h2>
						<hr></hr>
		    			{message}
		    		</div>
					<br></br>
		    		<button class="Button" name="view project" onClick={this.props.handleCurrentPage}>Back to view project</button>
	    		</div>
	    	)
		}
		else{
	    	return(
	    		<div class="Center">
		    		<div>
		    			<h1 class="PersonalPageName">{this.state.nickname}</h1>
		    			<p class="PersonalIntroduction">{this.state.intro}</p>
		    		</div>
		    		<div style={{marginTop:'100px'}}>
		    			<h2 class="h1">project list</h2>
						<hr></hr>
		    			{message}
		    		</div>
					<br></br>
		    		<button class="Button" name="view project" onClick={this.props.handleCurrentPage}>Back to view project</button>
	    		</div>
	    	)
	    }
    }
}

/*
// try to handle invalid address version
class PersonalPage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {submit: 0, whose_page:'', nickname:'', intro:'', created_project: [], user_exist:false};
		
		this.handleChange = this.handleChange.bind(this);
		this.handleBackwards = this.handleBackwards.bind(this);
	}
	
	get_personal_data = async () => {
		let list = [];
		const whose_page = this.state.whose_page;
		alert('whose_page = ' + whose_page);
		console.log('whose_page = ' + whose_page);
		const personal_data = await this.props.data.contract.methods.view_user_data(whose_page).call();		//address?
		for(let i = 0; i < personal_data[2]; i++){
			let project = await this.props.data.contract.methods.view_user_created_project(whose_page, i).call();
			list.push({id:i+1, name:project});
		}
		this.setState({nickname: personal_data[0], intro: personal_data[1], created_project: list});
	}

	check_valid_address = async () => {
		let user_exist = 2;
		const whose_page = this.state.whose_page;
		try {
			user_exist = await this.props.data.contract.methods.view_user_exist_or_not(whose_page).call();
		} catch(error) {
			alert('Error Message: ' + error);
		}
		console.log('user_exist = ' + user_exist);
		if(user_exist === 1){
			await this.setState({submit: 1});
			alert('submit = ' + this.state.submit)
		}
		else{
			await this.setState({submit: 2});
		}
	}

	handleChange(event) {
		const {name, value} = event.target;
		this.setState({[name]: value});
	}
	handleSubmit = async () =>  {
		await this.check_valid_address();
		//this.setState({submit: 1});
		alert('Search for ' + this.state.whose_page + '\'s personal page');
	}
    handleBackwards(event) {
    	this.setState({submit: 0, whose_page: ''});
    }

    render() {
    	let submit = this.state.submit;
    	alert('In render, before judging, submit = ' + submit);
    	if(submit === 0){
    		return(
    			<form>
	    			<label style={{color:'black'}}>
						Address:
						<input name="whose_page" type='text' value={this.state.whose_page} onChange={this.handleChange} />
					</label>
					<button name="submit" onClick={this.handleSubmit()}>Search</button>
				</form>
    		)
    	}
    	else if (submit === 1){
    		this.get_personal_data();
    		alert('In render, submit = 1');
	    	return(
	    		<div>
		    		<div>
		    			<h1 style={{textAlign: 'center', color: '#79D2C5', fontWeight: 'bold', fontSize:'60px'}}>{this.state.nickname}</h1>
		    			<hr style={{color: 'black', height: '5px'}}/>
		    			<h3 style={{textAlign: 'center'}}>About {this.state.nickname}</h3>
		    			<p style={{textAlign: 'center'}}>{this.state.intro}</p>
		    		</div>
		    		<div style={{marginTop:'100px'}}>
		    			<h2 style={{backgroundColor:'black', textAlign: 'center', color: '#79D2C5', fontWeight: 'bold', fontSize:'45px'}}>project list</h2>
		    			<ProjectBlock projectData={this.state.created_project} />
		    		</div>
		    		<button name="menu" onClick={this.props.handleCurrentPage}>Back to Menu</button>
		    		<br></br>
		    		<button name="submit" onClick={this.handleBackwards}>Search again</button>
	    		</div>
	    	)
	    }
	    else{
	    	return(
	    		<div>
		    		<div>
		    			<h1 style={{textAlign: 'center', color: 'red', fontWeight: 'bold', fontSize:'60px'}}>Invalid address</h1>
		    		</div>
		    		<button name="menu" onClick={this.props.handleCurrentPage}>Back to Menu</button>
			    	<br></br>
			    	<button name="submit" onClick={this.handleBackwards}>Search again</button>
			    </div>
	    	)
	    }
    }
}*/

export default PersonalPage;