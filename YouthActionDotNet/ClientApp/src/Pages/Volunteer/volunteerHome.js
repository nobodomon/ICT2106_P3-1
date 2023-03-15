import moment from "moment";
import React from "react"
import QRCode from "react-qr-code";
import { AppPageContainer, Loading } from "../../Components/appCommon";
import { Shimmer } from "../../Components/common";
import { StdInput } from "../../Components/input";
import "../../styles/volunteer-home.scss"

export default class VolunteerHome extends React.Component{
    state={
        loading:true,
        volunteerWork:[],
    }

    componentDidMount = async () =>{
        await this.getVolunteerWork().then((data)=>{
            if(data.success){
                this.setState({
                    volunteerWork:data.data,
                })
            }
        })
        this.setState({
            loading:false,
        })
    }

    getVolunteerWork = async () => {
        var loggedInVol = this.props.user.data;
        return fetch("/api/VolunteerWork/GetByVolunteerId/" + loggedInVol.UserId ,{
            method: "GET",
            headers:{
                "Content-Type": "application/json",
            },
        }).then(response => {
            return response.json();
        });
    }


    render(){
        return(
            this.state.loading?
            <Loading></Loading>
            :
            <div className="container">
                {this.props.user.data.ApprovalStatus == "Approved"?
                
                <VolunteerWorkList data={this.state.volunteerWork}></VolunteerWorkList>
                :
                <VolunteerPending></VolunteerPending>}
            </div>
        )
    }
}

class VolunteerPending extends React.Component{
    render(){
        return(
            <div className="hero min-h-screen bg-base-200">
                <div className="hero-content text-center">
                    <div className="max-w-md">
                    <h1 className="text-5xl font-bold">Hello there!</h1>
                    <p className="py-6">Your volunteer application has been submitted and pending for approval!</p>
                    </div>
                </div>
            </div>
        )
    }
}

class VolunteerWorkList extends React.Component{
    state={
        loading:true,
        excludes:["SupervisingEmployee","VolunteerId"],
        data:this.props.data,
    }

    componentDidMount = async () =>{
        this.getVolunteerWorkSettings().then((data)=>{
            if(data.success){
                this.setState({
                    settings:data.data,
                    fieldSettings:data.data.FieldSettings,
                    columnSettings:data.data.ColumnSettings,
                    loading:false,
                })
            }else{
                this.setState({
                    loading:false,
                })
            }
        });
    }

    getVolunteerWorkSettings = async () => {
        return fetch("/api/VolunteerWork/Settings",{
            method: "GET",
            headers:{
                "Content-Type": "application/json",
            },
        }).then(response => {
            return response.json();
        });
    }

    render(){
        return(
            this.state.loading?
            <progress className="progress w-full"></progress>
            :
            <div className="flex flex-col gap-4">
                <h1 className="text-2xl">Volunteer Work</h1>
                {this.props.data.map((item,index)=>{
                    return(
                        <VolunteerWorkExpandibleRow key={index} data={item} excludes={this.state.excludes} columnSettings = {this.state.columnSettings} fieldSettings= {this.state.fieldSettings}></VolunteerWorkExpandibleRow>
                    )
                })}
            </div>
        )
    };
}

class VolunteerWorkExpandibleRow extends React.Component{
    render(){
        const startDate = moment(this.props.data["ShiftStart"])
        const endDate = moment(this.props.data["ShiftEnd"])
        const projectName = this.props.fieldSettings["projectId"].options.find((item)=>{return item.value == this.props.data["projectId"]}).label
        return(
            <div className="collapse collapse-arrow rounded-box border show" tabIndex={0}>
                <input type="checkbox" className="peer"/> 
                <div className="collapse-title flex flex-col">
                    {/* {Object.keys(this.props.fieldSettings).map((key,index)=>{
                        if(this.props.excludes.includes(key)){
                            return null;
                        }else{
                            return(
                                <h1 key={index}>
                                    {this.props.fieldSettings[key].type == "dropdown" &&  this.props.data[key] != null &&
                                        this.props.fieldSettings[key].options.find((item)=>{return item.value == this.props.data[key]}).label
                                    }
                                    {this.props.fieldSettings[key].type == "datetime" && this.props.data[key] != null && 
                                        moment(this.props.data[key]).format("DD/MM/YYYY HH:mm a")
                                    }
                                    {this.props.fieldSettings[key].type != "dropdown" && this.props.fieldSettings[key].type != "datetime" &&
                                        this.props.data[key]
                                    }
                                </h1>
                            )
                        }
                    })} */}
                    <div className="text-lg font-bold pb-4">
                    Project: <span className="text-lg">{projectName}</span>
                    </div>
                    <div className="flex max-w-max">
                        <div className="stats stats-horizontal shadow">
                            <div className="stat">
                                
                                <div class="stat-title">Shift start</div>
                                <div className="stat-value text-primary">{startDate.format("DD MMM")}</div>
                                <div className="stat-desc font-bold text-lg">{startDate.format("hh:mm a")}</div>
                            </div>
                            <div className="stat">
                                <div class="stat-title">Shift end</div>
                                <div className="stat-value text-primary">{endDate.format("DD MMM")}</div>
                                <div className="stat-desc font-bold text-lg">{endDate.format("hh:mm a")}</div>
                            </div>
                        </div>    
                    </div>
                </div>
                <div className="collapse-content"> 
                    <div class="divider"></div> 
                    <VolunteerWorkCard fieldSettings = {this.props.fieldSettings} data = {this.props.data}></VolunteerWorkCard>
                </div>
            </div>
        )
    }
}

class VolunteerWorkCard extends React.Component{

    render(){
        return(
            <div className="container flex md:flex-row flex-col items-center justify-center p-4 gap-4">
                <div className="card w-96 bg-base-100 shadow-xl">
                    <figure className="px-10 pt-10">
                        <QRCode value={this.props.data.VolunteerWorkId} style={{maxWidth:"100%", height:"auto", width:"100%"}}></QRCode>
                    </figure>
                    <div className="card-body items-center text-center">
                        <h2 className="card-title">Work Id</h2>
                        <p>{this.props.data.VolunteerWorkId}</p>
                        <div className="card-actions">
                        </div>
                    </div>
                </div>
                <div className="flex flex-col w-full">
                    <h1 className="text-xl mx-3">
                        Work Info
                    </h1>
                    <div class="divider"></div> 
                    <div className="grid grid-cols-1 md:grid-cols-2">
                            
                        {Object.keys(this.props.fieldSettings).map((key,index)=>{
                            return (
                                <StdInput
                                key={index}
                                editable={false}
                                value={this.props.data[key]}
                                type={this.props.fieldSettings[key].type}
                                options={this.props.fieldSettings[key].options}
                                label={this.props.fieldSettings[key].displayLabel}
                                />
                            )
                        })} 
                            
                        </div>
                </div>
            </div>
        )
    }
}