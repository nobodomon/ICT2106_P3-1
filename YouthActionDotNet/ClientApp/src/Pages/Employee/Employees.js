
import React from "react"
import { Loading } from "../../Components/appCommon"
import DatapageLayout from "../PageLayout"

export default class Employees extends React.Component {
    state={
        content:null,
        headers:[],
        loading:true,
        settings: {},
        error: "",
    }

    settings ={
        title:"Employees",
        primaryColor: "#a6192e",
        accentColor: "#94795d",
        textColor: "#ffffff",
        textColorInvert: "#606060",
        api: "/api/Employee/",

        
        overviewUrl : "/api/Employee/All"
    }

    async componentDidMount(){
        await this.getContent(1,20).then((content)=>{
            console.log(content);
            this.setState({
                content:content,
            });
        })

        await this.getCount().then((content)=>{
            console.log(content);
            this.setState({
                count:content.data,
            });
        })

        await this.getSettings().then((settings)=>{
            console.log(settings);
            this.setState({
                settings:settings,
            });
        })

        this.setState({
            loading:false,
        })
    }

    getSettings = async () => {
        // fetches http://...:5001/api/User/Settings
        return fetch(this.settings.api + "Settings" , {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        }).then(res => {
            console.log(res);
            return res.json();
        })
    }

    getCount = async() =>{
        return fetch(this.settings.api + "Count" , {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        }).then(res => {
            console.log(res);
            return res.json();
        })
    }

    getContent = async(page,pageSize) =>{
        let api = "";
        if(page === undefined || pageSize === undefined){
            api = this.settings.api + "All";
        }else{
            api = this.settings.api + "All/" + page + "/" + "pageSize=" + pageSize;
        }
        return fetch(api , {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        }).then(res => {
            console.log(res);
            //Res = {success: true, message: "Success", data: Array(3)}
            return res.json();
        });
    }

    update = async (data) =>{
        console.log(data);
        return fetch(this.settings.api + "UpdateAndFetch/" + data.UserId , {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data)
        }).then(async res => {
            return res.json();
        });
    }

    handleUpdate = async (data) =>{
        await this.update(data).then((content)=>{
            if(content.success){
                this.setState({
                    error:"",
                })
                return true;
            }else{
                this.setState({
                    error:content.message,
                })
                return false;
            }
        })
    }

    requestRefresh = async () =>{
        this.setState({
            loading:true,
        })
        await this.getContent().then((content)=>{
            console.log(content);
            this.setState({
                content:content,
                loading:false,
            });
        })
    }
    requestError = async (error) =>{
        this.setState({
            error:error,
        })
    }


    render(){
        if(this.state.loading){
            return <Loading></Loading>
        }else{
            
        return(
            <DatapageLayout 
                settings={this.settings}
                fieldSettings={this.state.settings.data.FieldSettings} 
                headers={this.state.settings.data.ColumnSettings} 
                data={this.state.content.data}
                updateHandle = {this.handleUpdate}
                requestRefresh = {this.requestRefresh}
                error={this.state.error}
                permissions={this.props.permissions}
                requestError={this.requestError}
                pageManager={this.getContent}
                itemCount={this.state.count}
                >
            </DatapageLayout>
            )
        }
    }
}

