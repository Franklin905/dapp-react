pragma solidity >=0.4.21 <0.7.0;
import "./User.sol";

/*library Console {
  event _TruffleConsoleLog(bool boolean);
  event _TruffleConsoleLog(int num);
  event _TruffleConsoleLog(uint num);
  event _TruffleConsoleLog(string str);
  event _TruffleConsoleLog(bytes32 b32);
  event _TruffleConsoleLog(address addr);

  event _TruffleConsoleLogNamed(bytes32 label, bool boolean);
  event _TruffleConsoleLogNamed(bytes32 label, int num);
  event _TruffleConsoleLogNamed(bytes32 label, uint num);
  event _TruffleConsoleLogNamed(bytes32 label, string str);
  event _TruffleConsoleLogNamed(bytes32 label, bytes32 b32);
  event _TruffleConsoleLogNamed(bytes32 label, address addr);

  function log(bool x) public {
    emit _TruffleConsoleLog(x);
  }

  function log(int x) public {
    emit _TruffleConsoleLog(x);
  }

  function log(uint x) public {
    emit _TruffleConsoleLog(x);
  }

  function log(string memory x) public {
    emit _TruffleConsoleLog(x);
  }

  function log(bytes32 x) public {
    emit _TruffleConsoleLog(x);
  }

  function log(address x) public {
    emit _TruffleConsoleLog(x);
  }

  function log(bytes32 x, bool y) public {
    emit _TruffleConsoleLogNamed(x, y);
  }

  function log(bytes32 x, int y) public {
    emit _TruffleConsoleLogNamed(x, y);
  }

  function log(bytes32 x, uint y) public {
    emit _TruffleConsoleLogNamed(x, y);
  }

  function log(bytes32 x, string memory y) public {
    emit _TruffleConsoleLogNamed(x, y);
  }

  function log(bytes32 x, bytes32 y) public {
    emit _TruffleConsoleLogNamed(x, y);
  }

  function log(bytes32 x, address y) public {
    emit _TruffleConsoleLogNamed(x, y);
  }
}*/

contract Fund is User{
    struct msgboard{
        string[] msg;
        address[] sender;
    }
    struct project{
        string  title;
        string  intro;
        string  topic;
        address payable owner;
        uint  target_money;
        uint  current_money;
        uint  accumulate_money;
        uint  deadline;
        address payable[] sponsors;
        uint[] money_of_sponsors;
        bool stop;
        bool voting_end;
        msgboard board;
    }
    mapping(string=>project) internal title_to_project;
    string[] internal index_to_project;
    //uint internal bonus_for_voting_starter = 1000000;
    // time = 1577808000000+block.number*60*60*24*1000;//1577808000000代表2020/1/1 0:0:0

    function add_project(string memory _title, string memory _topic, string memory _intro, uint _target_money, uint _deadline) public {
            require(title_to_project[_title].target_money==0,"ERROR: project with same title exists");
            require(_target_money>0,"");
            if(!user_exist[msg.sender]){
              add_user("", "");
            }
            project memory _p;
            _p.title = _title;
            _p.topic = _topic;
            _p.intro = _intro;
            _p.target_money = _target_money;
            _p.deadline = _deadline;
            _p.stop = false;
            _p.voting_end = false;
            user_create_project(msg.sender, _title);
            title_to_project[_title] = _p;
            index_to_project.push(_title);
        //Console.log(title_to_project[_title].view_title());
    }
    function recieve_value_to_project(string memory _title) public payable {
        require(!title_to_project[_title].stop,"This project stop receive money!");
        if(!user_exist[msg.sender]){
          add_user("", "");
        }
        title_to_project[_title].current_money += msg.value;
        title_to_project[_title].accumulate_money += msg.value;
        uint i;
        uint _i;
        bool found = false;
        for(i = 0 ; i<title_to_project[_title].sponsors.length ; i++){
          if(msg.sender==title_to_project[_title].sponsors[i]){
            found = true;
            _i = i;
          }
        }
        if(!found){
          title_to_project[_title].sponsors.push(msg.sender);
          title_to_project[_title].money_of_sponsors.push(msg.value);
          _i = title_to_project[_title].sponsors.length-1;
        }
        if(title_to_project[_title].accumulate_money >= title_to_project[_title].target_money){//recieve to much money, send back, start voting
            title_to_project[_title].current_money -= title_to_project[_title].accumulate_money-title_to_project[_title].target_money;
            title_to_project[_title].money_of_sponsors[_i] -= title_to_project[_title].accumulate_money-title_to_project[_title].target_money;
            address payable _sender = msg.sender;
            _sender.transfer(title_to_project[_title].accumulate_money-title_to_project[_title].target_money);
            title_to_project[_title].accumulate_money = title_to_project[_title].target_money;
            title_to_project[_title].stop = true;
        }
        user_send_money_to_project(msg.sender,_title,
          title_to_project[_title].money_of_sponsors[_i]);
    }
    function transfer_value_to_project_owner(string memory _title, uint _money) internal{
        //require(title_to_project[_title].current_money >= _money,"error!"); //0609
        require(address(this).balance >= _money,"error!");
        title_to_project[_title].owner.transfer(_money);
        title_to_project[_title].current_money -= _money;
    }/*
    function view_project(string memory _title) public view returns(string memory,string memory,uint,uint,uint,uint,address){
        return(
          title_to_project[_title].intro,
          title_to_project[_title].topic,
          title_to_project[_title].current_money,
          title_to_project[_title].accumulate_money,
          title_to_project[_title].target_money,
          title_to_project[_title].deadline,
          title_to_project[_title].owner
        );

    }*/
    // 2020/06/18 prevent same project name
    function check_title (string memory _title) public view returns(bool){
    	uint i;
    	uint l = index_to_project.length;
     	for(i = 0 ; i<l; i++){
     		if(keccak256(abi.encodePacked(index_to_project[i])) == keccak256(abi.encodePacked(_title))) {
     			return true;
     		}
     	}
        return false;
    }
    /*
    function view_topic (string memory _title) public view returns(string memory){
        return title_to_project[_title].topic;
    }
    function view_intro (string memory _title) public view returns(string memory){
        return title_to_project[_title].intro;
    }
    function view_cur_money (string memory _title) public view returns(uint){
        return title_to_project[_title].current_money;
    }
    function view_tar_money (string memory _title) public view returns(uint){
        return title_to_project[_title].target_money;
    }*/
    function view_project_list_length() public view returns (uint){
        return index_to_project.length;
    }
    function view_project_list(uint i) public view returns (string memory,string memory,string memory,uint,uint,uint,uint){
        return (
                title_to_project[index_to_project[i]].title,
                title_to_project[index_to_project[i]].intro,
                title_to_project[index_to_project[i]].topic,
                title_to_project[index_to_project[i]].current_money,
                title_to_project[index_to_project[i]].accumulate_money,
                title_to_project[index_to_project[i]].target_money,
                title_to_project[index_to_project[i]].deadline
              );
    }
    function comment_on_board(string memory _title, string memory _msg) public {
        title_to_project[_title].board.msg.push(_msg);
        title_to_project[_title].board.sender.push(msg.sender);
    }
    function view_comment_length(string memory _title) public view returns(uint){
        return title_to_project[_title].board.msg.length;
    }
    function view_comment(string memory _title, uint i) public view returns(string memory, address){
        return(title_to_project[_title].board.msg[i], title_to_project[_title].board.sender[i]);
    }
    /*
    function view_project_title(uint i) public view returns(string memory){
        return title_to_project[index_to_project[i]].title;
    }
    function view_project_intro(uint i) public view returns(string memory){
        return title_to_project[index_to_project[i]].intro;
    }
    function view_project_topic(uint i) public view returns(string memory){
        return title_to_project[index_to_project[i]].topic;
    }
    
    function view_project_accumulate_money(uint i) public view returns(uint){
        return title_to_project[index_to_project[i]].accumulate_money;
    }
    function view_project_target_money(uint i) public view returns(uint){
        return title_to_project[index_to_project[i]].target_money;
    }
    function view_project_deadline(uint i) public view returns(uint){
        return title_to_project[index_to_project[i]].deadline;
    }
    function view_project_owner(uint i) public view returns(address){
        return title_to_project[index_to_project[i]].owner;
    }*/
    function view_project_current_money(string memory _title) public view returns(uint){
        return title_to_project[_title].current_money;
    }
    function view_project_stop(uint i) public view returns(bool){
        return title_to_project[index_to_project[i]].stop;
    }
    /*function view_project_voting_end(uint i) public view returns(bool){
        return title_to_project[index_to_project[i]].voting_end;
    }*/
    function view_project_voting_end(string memory _title) public view returns(bool){
        return title_to_project[_title].voting_end;
    }
    function pay_back_money(string memory _title) private {
      uint i;
      for(i = 0 ; i < title_to_project[_title].sponsors.length ; i++){
        title_to_project[_title].sponsors[i].transfer(title_to_project[_title].money_of_sponsors[i]/**
        (title_to_project[index_to_project[i]].current_money/title_to_project[index_to_project[i]].accumulate_money*/);
        title_to_project[_title].money_of_sponsors[i] = 0;
      }
    }
    function start_voting(string memory _title) public{
      // require(title_to_project[_title].deadline < 1577808000000+block.number*60*60*24*1000,"error start voting");
      //msg.sender.transfer(1000000);//send bonus to voting starter
      uint i;
      for(i = 0 ; i < title_to_project[_title].sponsors.length ; i++){
          user_start_voting(title_to_project[_title].sponsors[i],_title);
      }
      title_to_project[_title].deadline += 5*60*60*24;//voting deadline;
    }
    function stop_voting(string memory _title) public{
      // require(title_to_project[_title].deadline < 1577808000000+block.number*60*60*24*1000,"Error stop voting");
      // require(title_to_project[_title].voting_end == false,"Error voting ended");
      // msg.sender.transfer(1000000);//send bonus to voting stoper
      //check voting result
      uint total = 0;
      uint agree = 0;
      uint disagree = 0;
      uint user_state = 0;
      uint i;
      for(i = 0 ; i < title_to_project[_title].sponsors.length ; i++){
          if(project_voting[title_to_project[_title].sponsors[i]][_title]==2){//agree
              agree += title_to_project[_title].money_of_sponsors[i];
              total += title_to_project[_title].money_of_sponsors[i];
          }
          else if(project_voting[title_to_project[_title].sponsors[i]][_title]==3){//disagree
              disagree += title_to_project[_title].money_of_sponsors[i];
              total += title_to_project[_title].money_of_sponsors[i];
          }
      }
      if(agree>disagree && total>(title_to_project[_title].sponsors.length/4)){//threshold
        transfer_value_to_project_owner(_title,title_to_project[_title].current_money-2*1000000);
        user_state = 4;
      }
      else{
        pay_back_money(_title);
        user_state = 5;
      }
      //change users' voting state
      for(i = 0 ; i < title_to_project[_title].sponsors.length ; i++){
        user_stop_voting(title_to_project[_title].sponsors[i],_title, user_state);//voting success
      }
      //TODO multistage: For now, it's the end of a funding project.

      //title_to_project[_title].deadline += 5*60*60*24*1000;
      title_to_project[_title].voting_end = true;
      title_to_project[_title].stop = true;
    }
////////0527}
    function start_voting_or_not(string memory _title) public view returns(bool){
        if(project_voting[title_to_project[_title].sponsors[0]][_title] != 0){
            return true;
        }
        else{
            return false;
        }
    }
}