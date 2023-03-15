
import React from "react"
import { json } from "react-router-dom"
import { Loading } from "../../Components/appCommon"
import { IconButtonWithText, MultiStepBox, StdButton } from "../../Components/common"
import { StdInput } from "../../Components/input"
import DatapageLayout from "../PageLayout"

import "../../styles/permissions.scss"

export default class Permissions extends React.Component {
    state={
        content:null,
        headers:[],
        loading:true,
        settings: {},
        error: "",
        currentStep:0,
    }

    settings ={
        title:"Permissions",
        primaryColor: "#a6192e",
        accentColor: "#94795d",
        textColor: "#ffffff",
        textColorInvert: "#606060",
        api: "/api/Permissions/",
    }

    async componentDidMount(){
        await this.getPermissions().then((permissions)=>{
            console.log(permissions);
            this.setState({
                permissions:permissions.data.Permission,
            });
        })
        await this.getContent().then((content)=>{
            console.log(content);
            this.setState({
                content:content,
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

    getContent = async () =>{
        return fetch( this.settings.api + "All" , {
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
    getPermissions = async () =>{
        return fetch( "/api/Permissions/GetPermissions/" + this.props.user.data.Role , {
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
        return fetch(this.settings.api + "UpdateAndFetch/" + data.Id , {
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
        return await this.update(data).then((content)=>{
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
        const extraHandles = {}
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
                requestError = {this.requestError}
                extraComponents = {
                    [
                        {
                            label: "Update Modules", 
                            key: "updateModules", 
                            requiredPerms: ["Create","Update"],
                            component: <ModuleUpdate
                            requestError = {this.requestError}
                            requestRefresh = {this.requestRefresh}
                            data = {this.state.content.data}
                            api = {this.settings.api}>
                            </ModuleUpdate>
                        }
                    ]
                }
                >
                {this.state.content.data.map((item, index) => {
                    return (
                        <div className="staff-extended">
                            <PermissionsMap handleUpdate={this.handleUpdate} item={item}></PermissionsMap>
                        </div>
                    )
                })}
            </DatapageLayout>
            )
        }
    }
}

export class PermissionsMap extends React.Component {
    state= {
        item: this.props.item,
        loading:true,
        message:"",
    }
    componentDidMount(){
        this.setState({
            permission: JSON.parse(this.props.item.Permission),
            loading:false
        })
    }
    onChange = (index,key)=>{
        let permission = this.state.permission;
        permission[index][key] = !permission[index][key]; 
        this.setState({
            permission:permission
        })
    }

    clear = (index) => {
        let permission = this.state.permission;
        permission[index].Create = false;
        permission[index].Read = false;
        permission[index].Update = false;
        permission[index].Delete = false;
        this.setState({
            permission:permission
        })
    }

    handleUpdate = async () =>{
        var data = this.state.item;
        data.Permission = JSON.stringify(this.state.permission);
        this.setState({
            loading:true
        })
        await this.props.handleUpdate(data).then((res)=>{
            if(res){
                this.setState({
                    loading:false,
                    success:true,
                    message : "Changes saved!"
                })
            }else{
                this.setState({
                    loading:false,
                    success:false,
                    message : "Error saving permissions!"
                })
            }
        })
    }
    render(){
        return(
            this.state.loading ? 
            <Loading></Loading>
            :
            
            <div className="flex flex-col gap-4">
                {this.state.message != "" ?
                <div 
                    className={"alert " + (this.state.success ? "alert-success" : "alert-danger")} 
                    onClick={()=>{this.setState({message:""})}}
                >{this.state.message}</div>
                :
                <span></span>
                }
                <div className="grid md:grid-cols-2 grid-cols-1 gap-4">
                    {this.state.permission.map((item, moduleIndex) => {
                            return <div className="p-4 md:w-full w-1/2 permission-module-container flex-col flex  border rounded-md">
                                <div className="flex justify-between align-center">
                                   <h1 className="font-bold">{item.Module}</h1>
                                    <IconButtonWithText onClick={()=>this.clear(moduleIndex)} label={"Clear All"} icon={<i className="bi bi-x-circle"></i>}></IconButtonWithText>
                                </div>
                                <div className="divider"/>
                                <div className="grid md:grid-cols-4 grid-cols-4">
                                {Object.keys(item).slice(1).map((key, index) => {
                                    return(
                                        <div className="flex flex-col gap-4">
                                            <div className="permission-toggle-label">
                                                {key}
                                            </div>
                                            <div>
                                                <input className="toggle toggle-primary" type="checkbox" checked={item[key]} onChange={()=>this.onChange(moduleIndex,key)}></input>
                                            </div>
                                        </div>
                                    )
                                        
                                })}
                                </div>
                            </div>
                    })}
                </div>
                <StdButton style={"w-full"} onClick={this.handleUpdate}>
                    Save Changes
                </StdButton>
            </div>
        )
    }
}


class ModuleUpdate extends React.Component{

    state = {
        currentStep: 0,
        newModule:"",
        loading:true,
    }

    componentDidMount(){
        this.getAllModules().then((res)=>{
            console.log(res);
            this.setState({
                modules:res.data,
                loading:false,
            })
        })
    }
    

    getAllModules = async () =>{
        return fetch(this.props.api + "GetAllModules" , {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        }).then(async res => {
            return res.json();
        });
    }

    moduleOnChange = (field,value) => {
        this.setState({
            newModule:value,
        })
    }

    addModule = async (name) =>{
        return fetch(this.props.api + "CreateModule/" + name , {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: name
        }).then(async res => {
            return res.json();
        });
    }

    handleAddModule = async (e) =>{
        await this.addModule(this.state.newModule).then((content)=>{
            if(content.success){
                this.props.requestRefresh();
            }else{
                this.props.requestError(content.message);
            }
        })
    }

    deleteModule = async (name) =>{
        return fetch(this.props.api + "RemoveModule/" + name , {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: name
        }).then(async res => {
            return res.json();
        });
    }

    handleDeleteModule = async (e) =>{
        await this.deleteModule(this.state.newModule).then((content)=>{
            if(content.success){
                this.props.requestRefresh();
            }else{
                this.props.requestError(content.message);
            }
        })
    }


    render(){
        return(
            this.state.loading ?
            <Loading></Loading>
            :
            
            <div className="container-fluid module-update-container">
                <div className="flex flex-col items-stretch">
                    <div className="tabs w-full">
                        <div 
                            className={"tab tab-bordered " + (this.state.currentStep === 0 ? "tab-active" : "")}
                            onClick={()=>{this.setState({currentStep:0})}}
                        >
                            <div>Add Module</div>
                        </div>
                        <div 
                            className={"tab tab-bordered " + (this.state.currentStep === 1 ? "tab-active" : "")}
                            onClick={()=>{this.setState({currentStep:1})}}
                        >
                            <div>Delete Module</div>
                        </div>
                    </div>
                    <MultiStepBox currentStep={this.state.currentStep} steps={
                    [{0: "Add Module"},
                    {1: "Delete Module"}]
                    }>
                        <form className="flex-col flex gap-4 p-4"  onSubmit={this.handleAddModule} >
                            <h1 className="text-lg font-bold">Add Module</h1>
                            <StdInput
                                type="text"
                                label="Module Name"
                                onChange={this.moduleOnChange}
                                enabled = {true}
                            ></StdInput>
                            <StdButton style={"w-full"} type={"submit"}>Submit</StdButton>
                        </form>
                        
                        <form className="flex-col flex gap-4 p-4"  onSubmit={this.handleDeleteModule} >
                            <h1 className="text-lg font-bold">Delete Module</h1>
                            <StdInput
                                type="text"
                                label="Module Name"
                                onChange={this.moduleOnChange}
                                enabled = {true}
                            ></StdInput>
                            <StdButton type={"submit"}>Submit</StdButton>
                        </form>
                    </MultiStepBox>
                        
                </div>
                <div className="existing-modules">
                    <h1 className="text-lg font-bold">Existing Modules</h1>
                    <div className="divider"/>
                    <div className="flex modules p-4">
                        {this.state.modules.map((item,index)=>{
                            return(
                                <div className="btn btn-primary">
                                    {item}
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        )
    }
}