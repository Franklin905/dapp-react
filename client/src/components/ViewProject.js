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
        this.state = {view_type: "all", current_project: 0, project_list: [], view_topic:'select'};
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
            temp_list.push(project[3]);     //current money
            temp_list.push(project[4]);     //accumulate money
            temp_list.push(project[5]);     //target money
            temp_list.push(project[6]);     //deadline
            list.push(temp_list)
        }
        this.setState({project_list: list});
    }

    /*
    progressBar = (progress) => {

    }*/

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
                const deadline = new Date(project[6] * 1000)
                const today = Date.now()
                const dayLeft = Math.round((deadline - today) / oneDay);
                return (
                    <div className="Project">
                        <img src="https://i.imgur.com/4AiXzf8.jpg" style={{width: "45vh"}}></img>
                        <h2 style={{marginTop:"5px", marginBottom:"10px"}}>{project[0]}</h2>
                        <div id="Progress">
                            <div style={{
                                position: "absolute",
                                width: String(project[4]/project[5]*100)+"%",
                                height: "100%",
                                backgroundColor: "rgb(0, 228, 0)"
                                }}></div>
                        </div>
                        <p nowrap style={{textAlign: "left",
                                        fontSize: "16px",
                                        margin: "2px 10px 0px 10px"}}>{dayLeft} days left</p>
                        <button name={String(index)} className="Button" onClick={this.handleCurrentProject}>View this project</button>
                        
                    </div>
                )
            });
            return (
                <div>
                    <h1>Project list</h1>
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
            const render_list = this.state.project_list.map(project => {
                const deadline = new Date(project[6] * 1000)
                return (
                    <div className="Project">
                        <img src="https://i.imgur.com/4AiXzf8.jpg" style={{width: "45vh"}}></img>
                        <h2>{project[0]}</h2>
                        <p>Introduction: {project[1]}</p>
                        <p>Topic: {project[2]}</p>
                        <p>Current money: {project[3]/1000000000000000000} Ether</p>
                        <p>Accumulate money: {project[4]/1000000000000000000} Ether</p>
                        <p>Target money: {project[5]/1000000000000000000} Ether</p>
                        <p>Deadline: {deadline.toLocaleString()}</p>
                        <button name="all" className="Button" onClick={this.handleCurrentProject}>Back to project list</button>
                        <br></br>
                        <button name="sponsor" className="Button" onClick={this.handleCurrentProject}>Sponsor this project</button>
                        <div id="Progress">
                            <div style={{
                                position: "absolute",
                                width: String(project[4]/project[5]*100)+"%",
                                height: "100%",
                                backgroundColor: "rgb(0, 228, 0)"
                                }}></div>
                        </div>
                    </div>
                )
            })
            const title = this.state.project_list[this.state.current_project][0]
            const deadline = new Date(this.state.project_list[this.state.current_project][6] * 1000)
            return (
                <div>
                    <h1>View project</h1>
                    <div className="Project_List">
                        {render_list[this.state.current_project]}
                        <CommentBoard data={this.props.data} title={title}/>
                        <Vote data={this.props.data} title={title} deadline={deadline}/>
                    </div>

                </div>
            )
        }
    }
}

export default ViewProject