import React from "react";
import { ActionsButton, DivSpacing, IconButton, IconButtonWithText, MultiStepBox, SearchBar, SearchTags, SizedBox, StdButton, TagsBox } from "../Components/common";
import {AccessDeniedPanel, Loading} from "../Components/appCommon";
import { StdInput } from "../Components/input";
import SlideDrawer, { DrawerItemNonLink } from "../Components/sideNav";
import { Cell, ListTable, HeaderRow, ExpandableRow } from "../Components/tableComponents";
import U from "../Utilities/utilities";
import { AddEntry, DeleteEntry,GenerateSpreadsheet } from "../Components/common";

export const searchSuggestions = [
]

const CurrentTags = [
]

const settings = {
}

export default class DatapageLayout extends React.Component {
    state = {
        drawerOpen: false,
        expanded: false,
        showBottomMenu: false,
        expansionContent: "",
        expansionComponent: "",
        popUpContent: "",
        data: this.props.data,
        itemsPerPage: 20,
        currentPage: 1,
        pageNumbers: [],
    }
    constructor(props) {
        super(props)

        this.drawerToggleClickHandler = this.drawerToggleClickHandler.bind(this);
        this.setExpansionContent = this.setExpansionContent.bind(this);
        this.handleSeeMore = this.handleSeeMore.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.expand = this.expand.bind(this);
    }
    componentDidMount = async () =>{
        document.title = this.props.settings.title;
        window.addEventListener("resize", this.resize.bind(this));
        this.resize();
        const perms = await this.props.permissions.find(p => p.Module === this.props.settings.title);
        const reformattedPerms = [];
        Object.keys(perms).forEach((perm)=>{
            return perm === "Module" ? null : 
                perms[perm] === true ? reformattedPerms.push(perm) : null
        });
        const pageNumbers = [];
        for (let i = 1; i <= Math.ceil(this.props.itemCount / this.state.itemsPerPage); i++) {
            pageNumbers.push(i);
        }
        let extraComponents = [];
        this.props.extraComponents?.length > 0 && 

            this.props.extraComponents.forEach((component)=>{
                
                U.checkSubset(component.requiredPerms,reformattedPerms) && 
                    extraComponents.push(component)
            })
        let tableHeaderActions = await this.populateActions(perms,extraComponents);
        this.setState({
            extraComponents: extraComponents,
            tableHeaderActions: tableHeaderActions,
            data: this.props.data,
            perms : perms,
            pageNumbers: pageNumbers,
        })
    }

    populateActions = async (perms,components)=>{
        let tableHeaderActions = [];
        if (perms?.Create) {
            tableHeaderActions.push({ label: "Add " + this.props.settings.title, onClick: () => { this.setExpansionContent("add") } })
        }
        if (perms?.Delete) {
            tableHeaderActions.push({ label: "Delete " + this.props.settings.title, onClick: () => { this.setExpansionContent("del") } })
        }
        tableHeaderActions.push({ label: "Generate Spreadsheet", onClick: () => { this.setExpansionContent("gs") } },)
        
        components.forEach((component)=>{
            tableHeaderActions.push({label: component.label, onClick: ()=>{this.setExpansionContent(component.key)}})
        })
        return tableHeaderActions;
    }

    rerenderPageNums = (e) => {
        const pageNumbers = [];
        for (let i = 1; i <= Math.ceil(this.state.data.length / e); i++) {
            pageNumbers.push(i);
        }

        this.setState({
            pageNumbers: pageNumbers
        })
    }

    pageNumberClick = async (number) => {

        if (number < 1 || number > this.state.pageNumbers.length) {
            return;
        }

        await this.props.pageManager(number * this.state.itemsPerPage);

        this.setState({
            currentPage: number
        })
    }

    expand() {
        if(this.state.expanded){
            this.setState({
                expanded: !this.state.expanded,
                expansionContent:"",
            })
        }else{
            this.setState({
                expanded: !this.state.expanded,
            })

        }
    }

    setExpansionContent = content => {
        if (this.state.expanded && this.state.expansionContent === content) {
            this.setState({
                expansionContent: "",
                expanded: false,
            })
        } else {

            this.setState({
                expansionContent: content,
                expanded: true,
            })
        }
    }
    drawerToggleClickHandler() {
        this.setState({
            drawerOpen: !this.state.drawerOpen
        })
    }

    resize() {
        if (window.innerWidth <= 760) {
            this.setState({
                showBottomMenu: true
            })
        } else {
            this.setState({
                showBottomMenu: false
            })
        }
    }

    handleSeeMore(content) {
        this.setState({
            popUpContent: content
        })
    }

    handleSearchCallBack = async (tags) =>{
        
        if(tags.length === 0){
            return this.setState({
                data: this.props.data
            })
        }

        this.setState({
            loading: true
        })

        await this.handleSearch(tags).then((data)=>{
            console.log(data);
            this.setState({
                data: data.data,
                loading: false
            })
        })
    }

    handleSearch = async (e) => {


        console.log(e);
        let overviewUrl = this.props.settings.api + "All";

        const pageData = {
            page: this.state.currentPage,
            pageSize: this.state.itemsPerPage,
        }

        return await fetch(overviewUrl,{
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: (
                JSON.stringify({
                    Data: e,
                    PageData: pageData
                })
            )
        }).then((response)=>{
            console.log(response);
            return response.json();
        })
    }

    handleClose() {
        this.setState({
            popUpContent: ""
        })
    }

    render() {

        // if(this.state.loading){
        //     return <div></div>
        // }

        if(this.state.content === ""){
            return <div></div>
        }
        const indexOfLastItem = this.state.currentPage * this.state.itemsPerPage;
        const indexOfFirstItem = indexOfLastItem - this.state.itemsPerPage;
        const currentItems = this.state.data.slice(indexOfFirstItem, indexOfLastItem);

        return (
            this.state.perms?.Read ? 
            <div className="flex flex-col w-full p-4 listPageContainer h-full">
                {this.props.error !== "" && 
                    <div className="listPageContainer-error">
                        {this.props.error}
                        <IconButton 
                            icon = {<i className="bi bi-x-circle-fill"></i>} 
                            onClick = {()=>this.props.requestError("")}
                        ></IconButton>
                    </div>
                }
                <div className="w-full h-full flex flex-col">
                    
                    <TableHeader actions={
                        this.state.tableHeaderActions
                    } 
                    requestRefresh={this.props.requestRefresh} 
                    fieldSettings={this.props.fieldSettings} 
                    settings={this.props.settings} 
                    showBottomMenu={this.state.showBottomMenu} 
                    handles={this.setExpansionContent} 
                    persist={this.state.showBottomMenu} 
                    expanded={this.state.expanded} 
                    component={this.state.expansionContent} 
                    handleClose={this.expand}
                    handleSearchCallBack = {this.handleSearchCallBack}
                    tagUpdate = {this.handleSearchCallBack}
                    data={this.state.data}
                    perms={this.state.perms}
                    requestError={this.props.requestError}
                    extraComponents={this.state.extraComponents}
                    ></TableHeader>
                    <DivSpacing spacing={1}></DivSpacing>
                    <div className="flex justify-center items-start flex-fill grow">
                        <ListTable settings={this.settings}>
                            <HeaderRow>
                                {Object.keys(this.props.headers).map((key, index) => {
                                    return <Cell width={"100%"} key={index}>{this.props.headers[key].displayHeader}</Cell>
                                })}
                            </HeaderRow>
                            {this.state.data && 
                            
                            currentItems.map((row, index) => {      
                                return <ExpandableRow 
                                updateHandle={this.props.updateHandle} 
                                values={row} 
                                fieldSettings={this.props.fieldSettings} 
                                key={index} 
                                settings={settings} 
                                headers={this.props.headers} 
                                setExpansionContent={this.setExpansionContent} 
                                handleSeeMore={this.handleSeeMore} 
                                handleClose={this.handleClose} 
                                hasFields={this.props.hasFields}
                                popUpContent={this.state.popUpContent}
                                perms={this.state.perms}>
                                    {this.props.children? 
                                    this.props.children[index + ((this.state.currentPage - 1) * this.state.itemsPerPage)]: 
                                    ""}
                                </ExpandableRow>
                            })}
                        </ListTable>
                        
                    </div>
                    <div className="flex justify-end page-nums-container self-end">
                        <div className="items-per-page">
                            <StdInput
                                type="dropdown"
                                label="hidden"
                                value={this.state.itemsPerPage}
                                onChange={(label,e) => 
                                    {
                                        this.setState({ itemsPerPage: parseInt(e) })
                                        this.rerenderPageNums( parseInt(e));
                                    }}
                                options={[
                                    {value: 5,label: "5 Per Page"},
                                    {value: 10,label: "10 Per Page"},
                                    {value: 15,label: "15 Per Page"},
                                    {value: 20,label: "20 Per Page"},
                                    {value: 25,label: "25 Per Page"},
                                    {value: 30,label: "30 Per Page"},
                                    {value: 35,label: "35 Per Page"},
                                    {value: 40,label: "40 Per Page"},
                                ]}
                                enabled={true}
                            >
                            </StdInput>
                        </div>
                        
                        <ul className="page-nums">
                            <li className={"page-direction prev " + (this.state.currentPage === 1 ? "disabled" : "")}>
                                <span href="#" onClick={() => this.pageNumberClick(this.state.currentPage - 1)}><i className="bi bi-chevron-left"></i></span>
                            </li>
                            {this.state.pageNumbers > 5 ? 
                                this.state.pageNumbers.map((number, index) => {
                                    if(this.state.currentPage > 3){
                                        if(number > this.state.currentPage - 3 && number < this.state.currentPage + 3){
                                            return (
                                                <li key={number} className={"page-num " + (this.state.currentPage === number ? "active" : "")}>
                                                    <span href="#" onClick={() => this.pageNumberClick(number)}>{number}</span>
                                                </li>
                                            )
                                        }
                                    }else{
                                        if(number < 7){
                                            return (
                                                <li key={number} className={"page-num " + (this.state.currentPage === number ? "active" : "")}>
                                                    <span href="#" onClick={() => this.pageNumberClick(number)}>{number}</span>
                                                </li>
                                            )
                                        }
                                    }
                                })
                            :
                                this.state.pageNumbers.map((number, index) => {
                                    return (
                                        <li key={number} className={"page-num " + (this.state.currentPage === number ? "active" : "")}>
                                            <span href="#" onClick={() => this.pageNumberClick(number)}>{number}</span>
                                        </li>
                                    )
                                })
                            }
                            <li className={"page-direction next " + (this.state.currentPage === this.state.pageNumbers.length ? "disabled" : "")}>
                                <span href="#" onClick={() => this.pageNumberClick(this.state.currentPage + 1)}><i className="bi bi-chevron-right"></i></span>
                            </li>
                        </ul>
                    </div>
                </div>
                <BottomMenu actions={
                        this.state.tableHeaderActions
                } settings={this.settings} show={this.state.drawerOpen} showBottomMenu={this.state.showBottomMenu} handles={this.setExpansionContent}></BottomMenu>
            </div>
            :
            <AccessDeniedPanel>
            </AccessDeniedPanel>
        )
    }
}
DatapageLayout.defaultProps = {
    hasFields: true
}

export class TableHeader extends React.Component {
    constructor(props) {
        super(props);
        this.toggleSearchBar = this.toggleSearchBar.bind(this);
        this.searchCallBack = this.searchCallBack.bind(this);
        this.onCancelClick = this.onCancelClick.bind(this);
        this.deleteAllTags = this.deleteAllTags.bind(this);
        this.state = {
            classList: "tableRow",
            searchBarExtended: false,
            currentTags: [],

        }
    }

    componentDidMount(){
        let fieldSettings = this.props.fieldSettings;

        let columns = Object.keys(fieldSettings).map((key, index) => {
            return key;
        })

        this.setState({
            columns: columns,
        })
    }


    onCancelClick = (tagToRemove) =>{
        let newTags = this.state.currentTags.filter((tag)=>{
            return tag !== tagToRemove;
        })
        this.setState({
            currentTags: newTags,
        })
        this.props.tagUpdate(newTags);
    }

    componentDidUpdate(prevProps) {
        if (this.props.persist !== prevProps.persist) {
            this.setState({
                searchBarExtended: true,
            })
        }
    }

    deleteAllTags = () => {
        this.setState({
            currentTags: [],
        })
        this.props.tagUpdate([]);
    }

    toggleSearchBar() {
        this.setState({
            searchBarExtended: !this.state.searchBarExtended,
        })
    }

    searchCallBack(tag) {
        console.log(tag);
        var curTags = this.state.currentTags;
        curTags.push(tag);
        this.setState({
            currentTags: curTags,
        })

        this.props.handleSearchCallBack(this.state.currentTags);
    }

    render() {


        return (
            <div className="tableHeader">
                <div className={"tableHeaderActions " + (this.props.component === "" ? "borderRadius" : "topBorderRadius")}>
                    <div className="flex justify-end items-center">
                        {this.props.showBottomMenu ? <div /> :
                            <div className="tableTitleContainer">
                                {/* <div className="tableTitlePulseAnimation-1" style={this.state.searchBarExtended ? { "--ScaleMultiplier": .75 } : { "--ScaleMultiplier": 2 }}>
                                </div>
                                <div className="tableTitlePulseAnimation-2" style={this.state.searchBarExtended ? { "--ScaleMultiplier": .75 } : { "--ScaleMultiplier": 2 }}>
                                </div>
                                <div className="tableTitlePulseAnimation-3" style={this.state.searchBarExtended ? { "--ScaleMultiplier": .75 } : { "--ScaleMultiplier": 2 }}>
                                </div> */}
                                <span className="tableTitle">{this.props.settings.title}</span>
                            </div>}
                            <SearchBar 
                            className={"searchHotBar"} 
                            onClick={this.toggleSearchBar} 
                            toggleTagMacros={this.props.handles} 
                            searchCallBack={this.searchCallBack} 
                            persist={this.props.showBottomMenu} 
                            suggestions={this.state.columns}
                            toolTip={<div>


                            <h6>(!interest)</h6>
                            <p>
                                ! is short for NOT, entires with column value equals to interest will be removed from the list
                            </p>
                        </div>}></SearchBar>
                        <IconButton title={"Refresh"} size={"48px"} icon={
                            <i className="bi bi-arrow-clockwise" onClick={this.props.requestRefresh}></i>
                        }>
                        </IconButton>
                        {this.props.showBottomMenu ? "" :
                            <div>
                                <TableQuickAction handles={this.props.handles}
                                    actions={this.props.actions}></TableQuickAction></div>}
                    </div>
                </div>
                <HeaderExpansion 
                perms = {this.props.perms}
                settings={this.props.settings} 
                requestRefresh={this.props.requestRefresh} 
                fieldSettings={this.props.fieldSettings} 
                expanded={this.props.expanded} 
                component={this.props.component}
                handleClose={this.props.handleClose} 
                data = {this.props.data}
                requestError = {this.props.requestError}
                extraComponents = {this.props.extraComponents}
                actions={this.props.actions}
                >
                </HeaderExpansion>
                <DivSpacing spacing={1}></DivSpacing>
                <TagsBox showlabel={true} enableDeleteAll={true} className=" p-2" deleteAllTags={this.deleteAllTags}>
                    {this.state.currentTags.map((tag, index) => {
                        return <SearchTags onCancelClick={() => this.onCancelClick(tag)} type={tag.type} key={index}>{tag.value}</SearchTags>
                    })}
                </TagsBox>
                <DivSpacing spacing={1}></DivSpacing>
            </div>
        )
    }
}
TableHeader.defaultProps = {
    component: "",
}

export class HeaderExpansion extends React.Component {
    state={
        currentStep: 0,
        steps: [],
        expanded:false,
    }
    componentDidMount(){
        let steps = {}
        let componentsToRender = [];
        if(this.props.perms.Create){
            steps[Object.keys(steps).length] = "add"
            componentsToRender.push(<AddEntry settings={this.props.settings} requestRefresh={this.props.requestRefresh} fieldSettings = {this.props.fieldSettings} requestError={this.props.requestError}></AddEntry>)
        }
        if(this.props.perms.Delete){
            steps[Object.keys(steps).length] = "del"
            componentsToRender.push(<DeleteEntry settings={this.props.settings} requestRefresh={this.props.requestRefresh} fieldSettings = {this.props.fieldSettings} requestError={this.props.requestError}></DeleteEntry>)
        }
        steps[Object.keys(steps).length] = "gs"
        componentsToRender.push(<GenerateSpreadsheet settings={this.props.settings} requestRefresh={this.props.requestRefresh} fieldSettings = {this.props.fieldSettings} data={this.props.data} requestError={this.props.requestError}></GenerateSpreadsheet>)
        this.props.extraComponents.forEach((component)=>{
            steps[Object.keys(steps).length] = component.key
            componentsToRender.push(component.component)
        })
        this.setState({
            steps: steps,
            componentsToRender: componentsToRender,
            currentStep: this.getKeyByValue(steps, this.props.component),
        })
    }

    getKeyByValue(obj, value){
        let key = Object.keys(obj).find(key => obj[key] === value);
        console.log(key);
        return parseInt(key);
    }

    componentDidUpdate(prevProps) {
        if(prevProps.component != this.props.component){
            this.setState({
                currentStep: this.getKeyByValue(this.state.steps, this.props.component),
            })
        }
        if(prevProps.expanded != this.props.expanded){
            this.setState({
                expanded: this.props.expanded,
            })
        }
    }

    render() {
            return (
                this.state.expanded?
                <HeaderExpansionPane handleClose={this.props.handleClose} title={this.props.actions[this.state.currentStep].label}>
                    <MultiStepBox currentStep = {this.state.currentStep} steps={this.state.steps}>
                        {this.state.componentsToRender.map((component, index) => {
                            return (React.cloneElement(component, {key: index}))
                        })}
                    </MultiStepBox>
                </HeaderExpansionPane>
                :
                <div></div>
            )

    }
}
class HeaderExpansionPane extends React.Component {
    render() {
        return (
            <div className="p-4 headerExpansionPane">
                <div className={"w-full flex justify-between items-center"}>
                    <h1>{this.props.title}</h1>
                    <IconButtonWithText icon={<i className="bi bi-x"></i>} onClick={this.props.handleClose} label={"Close"}></IconButtonWithText>
                </div>
                <div className="divider">Fill up the required information below</div>
                {this.props.children}
            </div>
        )
    }


}

export class TableFooter extends React.Component {
    render() {
        return (
            this.props.showBottomMenu ?
                <ActionsButton className={"fixed-bottom footer-Btn"} onClick={this.props.toggle}></ActionsButton> : ""
        )
    }
}

export class TableQuickAction extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showActionsMenu: false,
            actionsMenuClasses: "actionsMenu",
            actionsButtonClasses: "actionsMenuToggle"
        }
    }
    render() {

        return (
            <div className="flex quickActionsPanel items-center">
                <ActionsButton onClick={() => {
                    if (this.state.showActionsMenu) {
                        this.setState({
                            showActionsMenu: !this.state.showActionsMenu,
                            actionsMenuClasses: "actionsMenu cardBg",
                            actionsButtonClasses: "actionsMenuToggle"
                        })
                    } else {

                        this.setState({
                            showActionsMenu: !this.state.showActionsMenu,
                            actionsMenuClasses: "actionsMenu cardBg showActions",
                            actionsButtonClasses: "actionsMenuToggle active"
                        })
                    }
                }}>
                    {this.props.actions.map((action, index) => {
                        return (
                            <DrawerItemNonLink key={index} label={action.label} onClick={action.onClick}></DrawerItemNonLink>
                        )

                    })}
                </ActionsButton>
            </div>
        )
    }
}
export class BottomMenu extends React.Component{
    render(){
        return(
            this.props.showBottomMenu ? 
            <div className="dropdown dropdown-top dropdown-hover dropdown-start max-h-min sticky bottom-0 left-0">
                <label tabindex="0" className="btn m-1 btn-primary btn-circle"><i className="bi bi-grid-3x3-gap-fill"></i></label>
                <ul tabindex="0" className="dropdown-content menu p-2 shadow bg-base-100 rounded-box">
                {this.props.actions.map((action, index) => {
                        return (
                            <button className="btn btn-ghost w-full text-base-content" key={index} onClick={action.onClick}>
                                {action.label}
                            </button>
                        )

                    })}
                </ul>
            </div>
            :
            ""
        )
    }
}
