pragma solidity >=0.4.21 <0.7.0;
contract User{
	struct account{
		//address user_address;
		string nickname;
		string intro;
		string[] created_project;
		string[] sended_project;
		uint[] sended_money;
	}

	account[] internal users;
	mapping(address=>uint) internal user_exist;
	mapping(address=>uint) internal address_to_account_index;
	mapping(address=>mapping(string=>uint)) internal project_voting; //0:haven't started/stop 1:start 2:agree 3:disagree
	//mapping(address=>mapping(string=>uint)) internal sended_project_index;

	/////////external function

	function add_user(string memory _nickname, string memory _intro) public {
		if(user_exist[msg.sender]==0){
			account memory _a;
			//_a.user_address = msg.sender;
			_a.nickname = _nickname;
			_a.intro = _intro;
			users.push(_a);
			address_to_account_index[msg.sender] = users.length-1;
			user_exist[msg.sender] = 1;
		}
		else{
			users[address_to_account_index[msg.sender]].nickname = _nickname;
			users[address_to_account_index[msg.sender]].intro = _intro;
		}
	}
	function view_user_exist_or_not(address _address) public view returns(uint){
		return user_exist[_address];
	}
	function view_user_data(address _address) public view returns(string memory,string memory,uint){
		return (
		users[address_to_account_index[_address]].nickname,
		users[address_to_account_index[_address]].intro,
		users[address_to_account_index[_address]].created_project.length
		);
	}
	function view_user_created_project(address _address, uint i) public view returns (string memory){
		return users[address_to_account_index[_address]].created_project[i];
	}

	function user_voting( string calldata _title, bool agree) external{
		//require(project_voting[msg.sender][_title]==1,"Error: already voted!");
		//require(1577808000+block.number*60*60*24*1<,"")
		if(agree){
			project_voting[msg.sender][_title] = 2;//agree
		}
		else{
			project_voting[msg.sender][_title] = 3;//disagree
		}
	}
	////////internal function

	function user_send_money_to_project(address _address, string memory _title, uint _value) internal{
		/*string memory temp = users[address_to_account_index[_address]].sended_project[sended_project_index[_address][_title]];
		if(!compareStrings(temp, _title)){
			users[address_to_account_index[_address]].sended_project.push(_title);
			users[address_to_account_index[_address]].sended_money.push(_value);
			sended_project_index[_address][_title] = users[address_to_account_index[_address]].sended_project.length-1;
		}
		else{
			users[address_to_account_index[_address]].sended_money[sended_project_index[_address][_title]] += _value;
		}*/
		uint i;
		bool found = false;
		for(i = 0 ; i<users[address_to_account_index[_address]].sended_project.length; i++){
			if(keccak256(abi.encodePacked((_title))) == keccak256(abi.encodePacked((users[address_to_account_index[_address]].sended_project[i])))){
				users[address_to_account_index[_address]].sended_money[i] += _value;
				found = true;
			}
		}
		if(!found){
			users[address_to_account_index[_address]].sended_project.push(_title);
			users[address_to_account_index[_address]].sended_money.push(_value);
		}
	}

	function user_create_project(address _address, string memory _title) internal{
		users[address_to_account_index[_address]].created_project.push(_title);
	}

	function user_start_voting(address _address, string memory _title) internal{
		require(project_voting[_address][_title]==0,"Error: already started");
		project_voting[_address][_title] = 1;
	}

	function user_stop_voting(address _address, string memory _title, uint value) internal{
		project_voting[_address][_title] = value;
	}

}