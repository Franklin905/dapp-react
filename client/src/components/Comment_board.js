import React from 'react';

function Message(props) {
	let divStyle={marginBottom:20, backgroundColor:'#C3E0F9', width:'500px', height:'60px'}
	let messageStyle={marginLeft:20, color:'black', textAlign:'left'}
	return(
		<div style={divStyle}>
			<div style={{color:'blue', fontWeight: "bold"}}>{props.name}</div>
			<div style={messageStyle}>{props.message}</div>
		</div>
	)
}

function MessageBlock(props) {
	let message = props.messageData.map((item)=>{
			return <Message key={item.id} name={item.name} message={item.message} />
	})
	return (
		<div>
			{message}
		</div>
	)
}

function CommentBlock(props) {
	return(
		<form style={{backgroundColor:'#C3E0F9', width:'500px', height:'40px'}}
			onSubmit={props.submit}>
			<input
				style={{height:'20px', width:'300px'}}
				type="text"
				value={props.message}
				placeholder='Say something...'
				onChange={props.change}/>
			<input type="submit" value="Submit"/>
		</form>
	)
}

class CommentBoard extends React.Component{
	constructor(props) {
		super(props);
		this.state = {currentId:0,
						message:'',
						data:[],
						submit: false
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
		console.log(event.target.value);			//this line is for debug
	}
	
	add_comment = async () => {
        const { accounts, contract } = this.props.data;
		await contract.methods.comment_on_board(
			this.props.title,
			this.state.message,		//change
			).send({
			from: accounts[0] ,
			value:0,
			gas:1000000,
			data:"0000"},function(error,hash){if(error){console.log(error);}})
    }

	read_comment = async () => {
		const title = this.props.title;
        let list=[];
        const comment_list_length = await this.props.data.contract.methods.view_comment_length(title).call();
        for(let i=0; i <= comment_list_length-1; i++){
            let comment = await this.props.data.contract.methods.view_comment(title, i).call();
            list.push({id:i+1, name:comment[1], message:comment[0]})		//comment[0]: message, comment[1]:sender
        }
        this.setState({data: list});
    }

	render(){
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
		return(
			<div>
				<MessageBlock messageData={this.state.data} />
				<hr/>
				<br></br>
				<CommentBlock message={this.state.message} submit={this.handleSubmit} change={this.handleChange} />
			</div>
		)
	}
}

export default CommentBoard;