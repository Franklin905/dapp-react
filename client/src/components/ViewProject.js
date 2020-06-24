import React, { Component } from "react"
import Sponsor from "./Sponsor"
import DropDownMenu from "./Drop_down_menu"
import CommentBoard from "./Comment_board"
import Vote from "./Vote"

class ViewProject extends Component {
    constructor(props) {
        super(props);
        this.handleCurrentProject = this.handleCurrentProject.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.state = {view_type: "all", current_project: 0, project_list: [], view_topic:'select', nickname:'LOU2_is_a_shit_game', user_exist:false};
    }

    handleCurrentProject(event) {
        const {name} = event.target
        if (name === "all") {
            this.setState({view_type: "all"})
        }
        else if (name === "sponsor") {
            this.setState({view_type: "sponsor"})
        }
        else {
            
            this.setState({view_type: "one"})
            this.setState({current_project: parseInt(name)})
        }
    }
    handleChange(event) {
        this.setState({view_topic: event.target.value});
    }

    handleSubmit(event) {
        // alert('Fundraising topics: ' + this.state.view_topic);     //remove(?)
        event.preventDefault();
    }

    read_project = async () => {
        let list=[];
        const project_list_length = await this.props.data.contract.methods.view_project_list_length().call();
        //console.log("get list_length success");
        for(let i=0;i<=project_list_length-1;i++){
            let project = await this.props.data.contract.methods.view_project_list(i).call();
            let temp_list = []
            temp_list.push(project[0]);     //title
            temp_list.push(project[1]);     //intro
            temp_list.push(project[2]);     //topic
            temp_list.push(project[3]);     //current money //accumulate money
            temp_list.push(project[4]);     //target money
            temp_list.push(project[5]);     //deadline
            temp_list.push(project[6]);     //owner
            list.push(temp_list)
        }
        this.setState({project_list: list});
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
    
    render() {
        this.read_project();
        if (this.state.view_type === "all") {
            const project_list_length = this.state.project_list.length;
            let temp = [];
            if (this.state.view_topic !== 'select'){
                for(let i=0; i <= project_list_length-1; i++){
                    if (this.state.project_list[i][2] === this.state.view_topic){
                        temp.push(this.state.project_list[i]);
                    }
                }
            }
            else{
                temp = this.state.project_list;
            }
            const render_list = temp.map((project, index) => {
                const oneDay = 24 * 60 * 60 * 1000
                const deadline = new Date(project[5] * 1000)
                const today = Date.now()
                let dayLeft = Math.round((deadline - today) / oneDay);
                if (dayLeft <= 0) dayLeft = 0;
                return (
                    <div className="Project">
                        <img name={String(index)} className="Button" onClick={this.handleCurrentProject} src="https://i.imgur.com/4AiXzf8.jpg" style={{width: "45vh"}}></img>
                        <h2 class="AllProjectHeader">{project[0]}</h2>
                        <div id="Progress">
                            <div style={{
                                position: "absolute",
                                width: String(project[3]/project[4]*100)+"%",
                                height: "100%",
                                backgroundColor: "#1FC173"
                                }}></div>
                        </div>
                        <span class="AllProjectMoney">${project[3]/1000000000000000000} | {String(Math.round(project[3]/project[4]*100))+"%"}</span>
                        <span class="AllProjectDayLeft">{dayLeft} days left</span>
                    </div>
                )
            });
            return (
                <div class= "Center">
                    <h1 class="h1">Project list</h1>
                    <DropDownMenu
                        value = {this.state.view_topic} 
                        handleChange = {this.handleChange}
                    />
                    <div className="Project_List">{render_list}</div>
                </div>
            )
        }
        else if (this.state.view_type === "sponsor") {
            return (
                <Sponsor  
                    data = {this.props.data}
                    handleCurrentPage = {this.props.handleCurrentPage}
                    handleCurrentProject = {this.handleCurrentProject}
                    current_project = {this.state.current_project}
                    project_data = {this.state.project_list[this.state.current_project]}
                />
            )
        }
        else {
                if(this.state.nickname==="LOU2_is_a_shit_game")
                {   
                    this.get_creator_data(this.state.project_list[this.state.current_project][6])
                }
                const render_list = this.state.project_list.map(project => {
                    const deadline = new Date(project[5] * 1000)
                    const oneDay = 24 * 60 * 60 * 1000
                    const today = Date.now()
                    let dayLeft = Math.round((deadline - today) / oneDay);
                    if (dayLeft <= 0) dayLeft = 0;
                    //<p>Current money: {project[3]/1000000000000000000} Ether</p>
                    return (
                        <div class="Center">
                            <h1 class="ProjectHeader">{project[0]}</h1>
                            <span class="Topic">{project[2]}</span>
                            <span> | Created by</span>
                            <button name={project[6]} class="CreatorButton" onClick={this.props.handleWhosePage}>{this.state.nickname}</button>
                            <p></p>
                            <div class="Block">
                                <img src="https://i.imgur.com/4AiXzf8.jpg" style={{width: "45vh"}}></img>
                                <div id="Progress">
                                    <div style={{
                                        position: "absolute",
                                        width: String(project[3]/project[4]*100)+"%",
                                        height: "100%",
                                        backgroundColor: "#1FC173"
                                        }}></div>
                                </div>
                            </div>
                            <div class="Block" style={{marginLeft: "10px"}}>
                                <p class="CurrentMoney">${project[3]/1000000000000000000}</p>
                                <p class="TargetMoney">Target ${project[4]/1000000000000000000}</p>
                                <p class="DayLeft">{dayLeft} Days Left</p>
                                <p class="Deadline">{deadline.toLocaleString()}</p>
                                <button name="sponsor" className="SponsorButton" onClick={this.handleCurrentProject}>Sponsor this project</button>
                                <button name="all" className="SponsorButton" onClick={this.handleCurrentProject}>Back to project list</button>
                            </div>
                            <div class="Project_List">
                                <p class="IntroductionTopic">Project Introduction</p>
                                <p class="Introduction">{project[1]}</p>
                                <hr class="PrimaryHr"></hr>
                            </div>
                            
                            
                        </div>
                    )
                })
            const title = this.state.project_list[this.state.current_project][0]
            const deadline = new Date(this.state.project_list[this.state.current_project][5] * 1000)
            return (
                <div>
                    <div className="Center">
                        {render_list[this.state.current_project]}
                        <span class="Block">
                            <div class="Interactions">Interactions</div>
                            <CommentBoard data={this.props.data} creator={this.state.project_list[this.state.current_project][6]} title={title} handleCurrentPage={this.props.handleCurrentPage}/>
                        </span>
                        <span class="Block">
                            <div class="Vote">Vote</div>
                            <Vote data={this.props.data} title={title} deadline={deadline}/>
                        </span>
                    </div>

                </div>
            )
        }
    }
}

export default ViewProject