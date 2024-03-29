import React from "react";
import { StdInput } from "../Components/input";
import { CalendarView } from "../Components/common";

const testOptions = [
    {label: "Option 1", value: 1}, 
    {label: "Option 2", value: 2},
    {label: "Option 3", value: 3},
    {label: "Option 4", value: 4},
    {label: "Option 5", value: 5},
    {label: "Option 6", value: 6},
]

export default class DefaultPage extends React.Component {

    componentDidMount() {
        document.title = "DASHBOARD"
    }

    render() {
        return (
            <BodyContainer>
                <div className="col-4">
                    <StdInput type={"text"} label={"Text Box"} onChange={()=>{}}></StdInput> 
                    <StdInput type={"password"} label={"Password Box"} onChange={()=>{}}></StdInput>
                    <StdInput type={"number"} label={"Number Box"} onChange={()=>{}}></StdInput>
                    <StdInput type={"time"} label={"Time Box"} onChange={()=>{}}></StdInput> 
                    <StdInput type={"date"} label={"Date Box"} onChange={()=>{}}></StdInput>   
                    <StdInput type={"datetime"} label={"Date Time Box"} onChange={()=>{}}></StdInput> 
                    <StdInput type={"dropdown"} options={testOptions} label={"Dropdown Box"}></StdInput>   
                    <StdInput type={"multiselect"} options={testOptions} label={"Multi-select Box"} onChange={()=>{}}></StdInput>
                </div>
                <div className="col-4">  
                    <StdInput enabled={true} type={"text"} label={"Text Box"} onChange={()=>{}}></StdInput>
                    <StdInput enabled={true} type={"password"} label={"Password Box"} onChange={()=>{}}></StdInput> 
                    <StdInput enabled={true} type={"number"} label={"Number Box"} onChange={()=>{}}></StdInput>
                    <StdInput enabled={true} type={"time"} label={"Time Box"} onChange={()=>{}}></StdInput> 
                    <StdInput enabled={true} type={"date"} label={"Date Box"} onChange={()=>{}}></StdInput>   
                    <StdInput enabled={true} type={"datetime"} label={"Date Time Box"} onChange={()=>{}}></StdInput>   
                    <StdInput enabled={true} options={testOptions} type={"dropdown"} label={"Dropdown Box"} onChange={()=>{}}></StdInput>   
                    <StdInput enabled={true} options={testOptions} type={"multiselect"} label={"Multi-select Box"} onChange={()=>{}}></StdInput>
                </div>
                <div className="col-4">  
                    <StdInput hasSaveBtn={true} enabled={true} type={"text"} label={"Text Box"} onChange={()=>{}}></StdInput>
                    <StdInput hasSaveBtn={true} enabled={true} type={"password"} label={"Password Box"} onChange={()=>{}}></StdInput> 
                    <StdInput hasSaveBtn={true} enabled={true} type={"number"} label={"Number Box"} onChange={()=>{}}></StdInput>
                    <StdInput hasSaveBtn={true} enabled={true} type={"time"} label={"Time Box"} onChange={()=>{}}></StdInput> 
                    <StdInput hasSaveBtn={true} enabled={true} type={"date"} label={"Date Box"} onChange={()=>{}}></StdInput>   
                    <StdInput hasSaveBtn={true} enabled={true} type={"datetime"} label={"Date Time Box"} onChange={()=>{}}></StdInput>   
                    <StdInput hasSaveBtn={true} enabled={true} options={testOptions} type={"dropdown"} label={"Dropdown Box"} onChange={()=>{}}></StdInput>   
                    <StdInput hasSaveBtn={true} enabled={true} options={testOptions} type={"multiselect"} label={"Multi-select Box"} onChange={()=>{}}></StdInput>   

                </div>
                <CalendarView></CalendarView>
            </BodyContainer>
        )
    }
}

export class BodyContainer extends React.Component {
    render() {
        return (
            <div className="row col-12 cardBg-light justify-content-center align-items-start ">
                {this.props.children}
            </div>
        )
    }
}



export class ListTile extends React.Component {
    state = {
        title: <div />,
        subtitle: <div />,
        leading: <div />
    }
    render() {
        return (
            <div className="flex items-center gap-4">
                {this.props.leading}
                <div className={"flex flex-col justify-content-between align-items-center"}>
                    <div className="mb-0">{this.props.title}</div>
                </div>
            </div>
        )
    }
}