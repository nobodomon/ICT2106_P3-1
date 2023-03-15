
import React from "react"
import { Loading } from "../../Components/appCommon"
import { StdInput } from "../../Components/input"
import DatapageLayout from "../PageLayout"

export default class Report extends React.Component {

    reportTypes = [
        {
            reportname: "Volunteer Work",
            fields: ["projectId", "startDate", "endDate"]
        },
        {
            reportname: "Employee Expense",
            fields: ["projectId", "startDate", "endDate"]
        },
    ]

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
        console.log(reportType);

        let dataToFetch = {}
        
        this.reportTypes[reportType].fields.forEach((field) => {
            dataToFetch[field] = "";
        })

        this.setState({
            selectedReportIndex:reportType,
            dataToFetch:dataToFetch,
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

        const selectedReport = this.reportTypes[this.state.selectedReportIndex];

        if(this.state.loading){
            return <Loading></Loading>
        }else{
            
        return(
            <div className="flex gap-4 p-4 relative">
                <div className="h-full flex flex-col">
            
                    {this.reportTypes.map((reportType, index) => {
                        return (
                            <ReportSection key={index} reportType={reportType} onSelectReportType={()=>this.onSelectReportType(index)}></ReportSection>
                        )
                    })}
                </div>

                {this.state.selectedReportIndex !== -1 &&
                    <div className="flex-grow flex flex-col">
                    <div className="card w-full">
                        <div className="card-title">
                            {selectedReport.reportname}
                        </div>
                        {selectedReport.fields.map((field, index) => {
                            return(
                                <StdInput
                                    key={index}
                                    label={field}
                                    fieldLabel={field}
                                    value={this.state.dataToFetch[field]}
                                    onChange={this.onChange}
                                    enabled={true}
                                >
                                
                                </StdInput>
                            )
                        })}
                    </div>
                </div>
                }
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