import React from 'react';

/*function Message(props) {
	let divStyle={marginBottom:20, backgroundColor:'#C3E0F9', width:'500px', height:'80px'}
	let messageStyle={marginLeft:20, color:'black', textAlign:'left'}
	return(
		<div style={divStyle}>
			<div style={{color:'blue', fontWeight: "bold", fontSize:'18px'}}>{props.name}</div>
			<div style={messageStyle}>{props.message}</div>
		</div>
	)
}

function MessageBlock(props) {
	let message = props.messageData.map((item)=>{
			return <Message key={item.id} name={item.name} message={item.message} handleCurrentPage={props.handleCurrentPage}/>
	})
	return (
		<div>
			{message}
		</div>
	)
}

function CommentBlock(props) {
	const commentBlock = {width:'500px', height:'40px'}
	const commentBlockInput =  {width: '400px', height: '20px', marginRight: "100px"}
	const commentBlockButton =  {
		fontSize: "18px",
		fontFamily: "'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif, Microsoft JhengHei",
		color: "rgb(253, 251, 230)",
		textDecoration: "underline",
		border: "1px solid #1FC173",
		backgroundColor: "#1FC173",
		borderRadius: "4px",
		marginRight: "32px",
		cursor: "pointer",
		textAlign: "center"
	}
	return(
		<form style={commentBlock}
			onSubmit={props.submit}>
			<input
				style={commentBlockInput}
				type="text"
				value={props.message}
				placeholder='Say something...'
				onChange={props.change}/>
			<input style={commentBlockButton} type="submit" value="Submit"/>
		</form>
	)
}*/

class CommentBoard extends React.Component{
	constructor(props) {
		super(props);
		this.state = {currentId:0,
						message:'',
						data:[],
						comment_length: 0,
						submit: false,
						nickname: ""
						};

		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleChange = this.handleChange.bind(this);
	}
	/*
	handleSubmit(event) {
		let copydata = this.state.data.slice();
		const dataLength = copydata.length;
		const currentId = this.state.currentId;
		copydata.push({id:currentId+1, name:'Guava', message:this.state.message});
		this.setState({currentId:currentId+1, data:copydata, submit:true});

		//console.log(this.state.data.name);
		//console.log(this.state.data.message);
		alert('A message was submitted: ' + this.state.message);
		event.preventDefault();
	}
	*/
	handleSubmit(event) {
		this.setState({submit:true});
		
		// alert('A message was submitted: ' + this.state.message);
		event.preventDefault();
	}

	handleChange(event) {
		this.setState({message: event.target.value});
		//console.log(event.target.value);			//this line is for debug
	}
	
	add_comment = async () => {
        const { accounts, contract } = this.props.data;
        //console.log('accounts[0] datatype = ', typeof(accounts[0]));
		await contract.methods.comment_on_board(
			this.props.title,
			this.state.message,		//change
			).send({
			from: accounts[0] ,
			value:0,
			gas:1000000,
			data:"0000"},function(error,hash){if(error){console.log(error);}})
	}
	
	get_creator_data = async (address) => {
		let user_exist = 2;
		try {
			user_exist = await this.props.data.contract.methods.view_user_exist_or_not(address).call();
		} catch(error) {
			alert('Error Message: ' + error);
		}
		if (user_exist == 1) {
			const personal_data = await this.props.data.contract.methods.view_user_data(address).call();
			this.setState({nickname: personal_data[0]});
		}
		else if (user_exist == 0){
			this.setState({nickname: 'Anonymous user'});
		}
    }

	read_comment = async () => {
		const title = this.props.title;
        let list=[];
		const comment_list_length = await this.props.data.contract.methods.view_comment_length(title).call();
		this.state.comment_length = comment_list_length;
        for(let i=0; i <= comment_list_length-1; i++){
			let comment = await this.props.data.contract.methods.view_comment(title, i).call();
			/*this.get_creator_data(comment[1]);*/
            list.push({id:i+1, name: comment[1], message:comment[0]})		//comment[0]: message, comment[1]:sender
        }
        this.setState({data: list});
    }

	render() {
		/*let data = [{id:1, name:'Apple', message:'Hello!'},
			{id:2, name:'Banana', message:'My name is Banana.'},
			{id:3, name:'Kiwi', message:'Cool!'},
			{id:4, name:'Lemmon', message:'I\'m going to school.'},
			{id:5, name:'Grape', message:'THE END'}]*/
		this.read_comment();
		const IsSubmit = this.state.submit;
		if (IsSubmit) {
			this.add_comment();
			this.setState({submit: false});
		}
		const render_list = this.state.data.map((item)=>{
			if (item.name === this.props.creator){
				return(
					<div class="CreatorMessageBlock">
						<div class="MessageName">{item.name}</div>
						<div class="MessageContent">{item.message}</div>
					</div>
				)
			}
			else{
				return(
					<div class="MessageBlock">
						<div class="MessageName">{item.name}</div>
						<div class="MessageContent">{item.message}</div>
					</div>
				)
			}
		})
		return(
			<div>
				<div class="CommentNumbers">{this.state.comment_length} comments</div>
				<form class="CommentBlock"
					onSubmit={this.handleSubmit}>
					<input
						class="CommentBlockInput"
						type="text"
						value={this.state.message}
						placeholder='Say something...'
						onChange={this.handleChange}/>
					<input class="CommentBlockButton" type="submit" value="Submit"/>
				</form>
				<br></br>
				
				<div>{render_list}</div>
				
			</div>
		)
	}
}

export default CommentBoard;