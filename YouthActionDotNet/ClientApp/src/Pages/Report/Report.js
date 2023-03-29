
import React, { useRef } from "react"
import { Loading } from "../../Components/appCommon"
import { MultiStepBox, StdButton, Stepv2 } from "../../Components/common"
import { StdInput } from "../../Components/input"
import DatapageLayout from "../PageLayout"
import { Document,Page, PDFViewer, Text, View } from "@react-pdf/renderer"
import {CSVLink} from "react-csv";

export default class Report extends React.Component {

    state={
        loading:true,
        settings: {},
        error: "",
        selectedReportIndex : -1,
        dataToFetch: {},
    }

    settings ={
    }

    async componentDidMount(){

        this.setState({
            loading:false,
        })
    }

    requestRefresh = async () =>{
        this.setState({
            loading:true,
        })
        
        this.setState({
            loading:false,
        })
    }
    
    onSelectReportType = (reportType) =>{
        this.setState({
            selectedReportIndex:reportType,
        })
            
    }

    requestError = async (error) =>{
        this.setState({
            error:error,
        })
    }

    onChange = (field, value) =>{
        let dataToFetch = this.state.dataToFetch;
        dataToFetch[field] = value;
        this.setState({
            dataToFetch:dataToFetch,
        })
    }


    render(){


        if(this.state.loading){
            return <Loading></Loading>
        }else{
            
        return(
            <div className="drawer drawer-mobile">
                <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
                <div className="drawer-content flex flex-col h-full items-center justify-center">
                    
                    <div className="grow flex flex-col w-full h-full">
                        <div className="card w-full h-full max-h-max grow">
                            <Stepv2 step={this.state.selectedReportIndex == 0}>
                                
                                <VolunteerWorkReportInput></VolunteerWorkReportInput>
                            </Stepv2>
                            <Stepv2 step={this.state.selectedReportIndex == 1}>
                                
                                <ExpenseReportInput></ExpenseReportInput>
                            </Stepv2>
                        </div>
                    </div>
                </div> 
                <div className="drawer-side">
                    <label htmlFor="my-drawer-2" className="drawer-overlay"></label> 
                    <ul className="menu gap-4 p-4 w-80 bg-base-100 text-base-content">
                        
                        <button className="btn btn-primary" onClick={()=>{
                            this.onSelectReportType(0);
                        }}>Voluntneer Work</button>
                        <button className="btn btn-primary" onClick={()=>{
                            this.onSelectReportType(1);
                        }}>Employee Expense</button>
                    </ul>
                
                </div>
            </div>
            )
        }
    }
}

class ReportSection extends React.Component{
    state={
        open:false,
    }

    render(){
        const reportType = this.props.reportType;
        return(
            
            <button className="btn btn-primary m-1 w-full" onClick={this.props.onSelectReportType}>{reportType.reportname}</button>
        )
    }
}

class VolunteerWorkReportInput extends React.Component{

    fields = ["projectId", "startDate", "endDate"];
    

    state={
        loading:true,
        dataToFetch: {
            "projectId": "",
            "startDate": "",
            "endDate": "",
        },
    }

    componentDidMount = async () =>{
        await this.getSettings().then((settings)=>{
            console.log(settings);
            this.setState({
                settings:settings.data,
            })
        })

        this.setState({
            loading:false,
        })
    }

    getSettings = async () =>{
        

        return fetch("/api/Expense/Settings", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        }).then((response)=>{
            console.log(response)
            return response.json();
        })
    }

    onChange = (field, value) =>{
        let dataToFetch = this.state.dataToFetch;
        dataToFetch[field] = value;
        this.setState({
            dataToFetch:dataToFetch,
        })
    }

    submitReportDetails = async () => {
        let dataToFetch = this.state.dataToFetch;

        console.log(dataToFetch)

        const result = await fetch("/api/Report/VolunteerWork",{
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(dataToFetch),
        }).then((response)=>{
            console.log(response)
            return response.json();
        })

        console.log(result);

        this.setState({
            result:result,
        })
    }



    render = () => {
        return(
            this.state.loading? 
            <Loading></Loading>
            :
            
            <div className="flex w-full h-full items-stretch justify-items-stretch gap-4">
                <div className="card w-56 flex flex-col items-stretch basis-1/4 gap-4">
                    <StdInput
                        field="projectId"
                        fieldLabel="projectId"
                        label="Project Id"
                        type="dropdown"
                        value={this.state.dataToFetch.projectId}
                        options={this.state.settings.FieldSettings.ProjectId.options}
                        allowEmpty={true}
                        onChange={this.onChange}
                        enabled={true}
                    />
                    <StdInput
                        field="startDate"
                        fieldLabel="startDate"
                        label="Start Date"
                        type="date"
                        value={this.state.dataToFetch.startDate}
                        onChange={this.onChange}
                        enabled={true}
                    />
                    <StdInput
                        field="endDate"
                        fieldLabel="endDate"
                        label="End Date"
                        type="date"
                        value={this.state.dataToFetch.endDate}
                        onChange={this.onChange}
                        enabled={true}
                    />
                    <StdButton onClick={this.submitReportDetails}>Get Report</StdButton>
                    
                    {this.state.result ? 
                        <VolunteerWork data={this.state.result.data} reportData={this.state.dataToFetch} FieldSettings={this.state.settings.FieldSettings}></VolunteerWork>
                    :null
                    }
                </div>
            </div>
        )
    }
}

class ExpenseReportInput extends React.Component{
    
    fields= ["projectId", "startDate", "endDate"]

    maxheight = Window.innerHeight - 56;

    state={
        loading:true,
        dataToFetch: {
            "projectId": "",
            "startDate": "",
            "endDate": "",
        },
    }

    componentDidMount = async () =>{
        await this.getSettings().then((settings)=>{
            console.log(settings);
            this.setState({
                settings:settings.data,
            })
        })

        this.setState({
            loading:false,
        })
    }

    getSettings = async () =>{
        

        return fetch("/api/Expense/Settings", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        }).then((response)=>{
            console.log(response)
            return response.json();
        })
    }

    onChange = (field, value) =>{
        let dataToFetch = this.state.dataToFetch;
        dataToFetch[field] = value;
        this.setState({
            dataToFetch:dataToFetch,
        })
    }

    submitReportDetails = async () => {
        let dataToFetch = this.state.dataToFetch;

        console.log(dataToFetch)

        const result = await fetch("/api/Report/EmployeeExpense",{
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(dataToFetch),
        }).then((response)=>{
            console.log(response)
            return response.json();
        })

        console.log(result);

        this.setState({
            result:result,
        })
    }


    
    render = () => {
        return(
            this.state.loading? 
            <Loading></Loading>
            :
            
            <div className="flex w-full h-full items-stretch justify-items-stretch gap-4">
                <div className="card w-56 flex flex-col items-stretch basis-1/4 gap-4">
                    <StdInput
                        field="projectId"
                        fieldLabel="projectId"
                        label="Project Id"
                        type="dropdown"
                        value={this.state.dataToFetch.projectId}
                        options={this.state.settings.FieldSettings.ProjectId.options}
                        allowEmpty={true}
                        onChange={this.onChange}
                        enabled={true}
                    />
                    <StdInput
                        field="startDate"
                        fieldLabel="startDate"
                        label="Start Date"
                        type="date"
                        value={this.state.dataToFetch.startDate}
                        onChange={this.onChange}
                        enabled={true}
                    />
                    <StdInput
                        field="endDate"
                        fieldLabel="endDate"
                        label="End Date"
                        type="date"
                        value={this.state.dataToFetch.endDate}
                        onChange={this.onChange}
                        enabled={true}
                    />
                    <StdButton onClick={this.submitReportDetails}>Get Report</StdButton>
                    
                    {this.state.result ? 
                        <ExpenseReport data={this.state.result.data} reportData={this.state.dataToFetch} FieldSettings={this.state.settings.FieldSettings}></ExpenseReport>
                    :null
                    }
                </div>
            </div>
        )
    }
}

const ExpenseReport = (props) => {
    
    const {data, reportData,FieldSettings} = props;


    const projectName = FieldSettings.ProjectId.options.find((option)=>option.value == reportData.projectId)?.label;

    let transformedData = []

    data.forEach((item)=>{
        let transformedItem = {...item,
            "ProjectName":projectName,
        }
        transformedData.push(transformedItem);
    })


    
    return (
        
        <CSVLink className={"btn btn-primary"} data={transformedData} filename={"ER_"+projectName+"_"+reportData.startDate+"_"+reportData.endDate}>DOWNLOAD</CSVLink>
    
    )

}

const VolunteerWork = (props) => {
    
    const {data, reportData,FieldSettings} = props;

    const projectName = FieldSettings.ProjectId.options.find((option)=>option.value == reportData.projectId)?.label;

    let transformedData = []

    data.forEach((item)=>{
        let transformedItem = {...item,
            "ProjectName":projectName,
        }
        transformedData.push(transformedItem);
    })


    return (
        
        <CSVLink className={"btn btn-primary"} data={transformedData} filename={"VW_"+projectName+"_"+reportData.startDate+"_"+reportData.endDate}>DOWNLOAD</CSVLink>
    
    )
}