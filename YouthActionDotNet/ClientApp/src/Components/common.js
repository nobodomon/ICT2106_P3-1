import React from "react";
import "../styles/Hamburger.scss";
import { Link } from "react-router-dom";
import { searchSuggestions } from "../Pages/PageLayout";
import moment from "moment";

import footer from "../Assets/footer.png";
import { Loading } from "./appCommon";
import { StdInput } from "./input";

import {CSVLink} from "react-csv";

export class DivSpacing extends React.Component {
    state = {
        spacing: 1
    }
    render() {
        return (
            <div className={"divSpacing-" + this.state.spacing}></div>
        )
    }
}

export class SizedBox extends React.Component {
    render() {
        const width = this.props.width;
        const height = this.props.height;
        return (
            <div style={{ width: width, height: height }} className={this.props.className} onClick={this.props.onClick}>
                {this.props.children}
            </div>
        )
    }
}
SizedBox.defaultProps = {
    width: "0px",
    height: "0px"
}

export class Footer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showCopyright: true
        }
    }
    componentDidMount() {
        window.addEventListener('resize', this.resize.bind(this));
        this.resize();
    }
    resize() {
        if (window.innerWidth <= 576) {
            this.setState({
                showCopyright: false
            }
            )
        } else {
            this.setState({
                showCopyright: true
            }
            )
        }
    }
    render() {
        return (
            <div className="footer">
                <div className="footer-content">
                    {this.state.showCopyright &&
                        <div className="footer-text no-print">Copyright &copy; 2022 Chimeric Technologies. All Rights Reserved.</div>
                    }
                    <img className="footer-Logo" alt={"footer Logo"} src={footer}></img>
                </div>
            </div>
        )
    }
}

export class StdInputDropDownOption extends React.Component {
    render() {
        return (
            <div className={"dropdownOptions " + this.props.className} type={this.props.type} value={this.props.value} onClick={this.props.onClick}>

                {this.props.children}
            </div>
        )
    }
}

export class StdInputCountryCodeDropDownOption extends React.Component {
    render() {
        return (
            <div className={"dropdownOptions "} value={this.props.value} onClick={this.props.onClick}>
                <span className="countryCode">{this.props.countryCode}</span>
                {this.props.children}
            </div>
        )
    }
}
StdInputDropDownOption.defaultProps = {
    value: "",
}




export class SearchBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            expanded: false,
            inputClasses: "SearchFieldGroup",
            showToolTip: false,
            searchQuery: "",
            selectedTag: "",
            tagType: "",
            suggestions: this.props.suggestions,
            macrosSuggestion: this.props.suggestions.filter(suggestion => suggestion.type === "macro"),
            specificSuggestion: this.props.suggestions.filter(suggestion => suggestion.type === "specific"),
            multipleSuggestion: this.props.suggestions.filter(suggestion => suggestion.type === "multiple"),
            placeholder: "",
        }
        this.searchInput = React.createRef();
        this.toggle = this.toggle.bind(this);
        this.focus = this.focus.bind(this);
        this.toggleToolTip = this.toggleToolTip.bind(this);
        this.searchCallBack = this.searchCallBack.bind(this);
        this.onCancelClick = this.onCancelClick.bind(this);
        this.handleKeydown = this.handleKeydown.bind(this);
        this.state.expanded = this.props.persist ? true : false;
        this.state.inputClasses = this.props.persist ? "SearchFieldGroup if-active" : "SearchFieldGroup";
    }

    componentDidUpdate(prevProps) {
        if (prevProps.persist !== this.props.persist) {
            this.updateAndNotify();
        }
    }

    focus() {
        if (!this.props.persist) {
            this.searchInput.current.focus()
        }
    }

    updateAndNotify() {
        this.setState({
            expanded: true,
            inputClasses: "SearchFieldGroup if-active"
        })
    }

    toggleToolTip = (e) => {
        e.stopPropagation()
        this.setState({
            showToolTip: !this.state.showToolTip
        })
    }
    toggle() {
        this.props.onClick();

        if (this.props.persist) {
            this.searchInput.current.focus();
            return;
        } else {

            if (this.state.expanded) {
                this.setState({
                    expanded: false,
                    inputClasses: "SearchFieldGroup"
                })
            } else {
                this.setState({
                    expanded: true,
                    inputClasses: "SearchFieldGroup if-active"
                })
                this.searchInput.current.focus();
            }
        }

    }

    setSearch(option) {
        this.searchInput.current.value = option;
    }

    setPrimaryInput(tag) {
        console.log(tag)
        this.setState({
            selectedTag: tag.value,
            tagType: tag.type,
        })
        this.searchInput.current.value = ""

        if (tag.value.slice(1) === "gender") {
            this.setState({
                suggestions: [{ value: "Male", label: "Male", type: "" }, { value: "Female", label: "Female", type: "" }],
                placeholder: "Enter a gender",
            })
        }
        this.searchInput.current.focus();
    }

    handleSearchQueryChange = (e) => {
        this.setState({
            searchQuery: e.target.value
        })
    }

    handleKeydown = (e, tag) => {
        if (e.key === "Enter") {
            this.searchCallBack(tag);
        }
    }

    searchCallBack(tag) {
        this.setState({
            selectedTag: "",
            tagType: "",
            suggestions: searchSuggestions,
            placeholder: "",
        })
        this.searchInput.current.value = ""
        this.searchInput.current.focus();
        this.props.searchCallBack(tag);
    }

    onCancelClick() {
        this.setState({
            selectedTag: "",
            tagType: "",
            suggestions: searchSuggestions,
            placeholder: "",
        })
        this.searchInput.current.value = "";
    }

    render() {

        return (
            <div className={this.props.className}>
                <div className={"flex justify-end items-center"}>
                    <div className="searchBar">
                        <SearchButton onClick={this.toggle} className={this.props.invert ? "invert" : ""} icon={<i className="bi bi-search"></i>} toolTip={this.props.toolTip} showToolTip={this.state.showToolTip} onMouseEnter={this.toggleToolTip} onMouseLeave={
                            this.toggleToolTip}></SearchButton>

                    </div>
                    
                            
                    <div className={"dropdown dropdown-end SearchFieldGroup " + this.state.inputClasses} onAnimationEnd={this.focus}>
                        <div className="form-control bg-transparent border-transparent p-0">
                            <div className="input-group">
                            {this.state.selectedTag !== "" &&
                                <SearchTags showEdit={false} onCancelClick={this.onCancelClick} type={this.state.tagType}>{this.state.selectedTag}</SearchTags>
                            }
                            <input
                                tabindex="0" 
                                type={"text"}
                                className={"input input-primary border-transparent hover:border-transparent text-base-content " + (this.state.expanded ? "w-full" : "w-0")}
                                placeholder={this.state.placeholder}
                                ref={this.searchInput} 
                                onChange={this.handleSearchQueryChange}
                                onKeyDown={(e) => this.handleKeydown(e, { type: this.state.tagType, value: this.searchInput.current.value })}></input>
                            </div>
                        </div>
                        
                        {this.state.selectedTag === "" ?
                            <div tabindex="0" class="menu dropdown-content bg-base-100 p-2 shadow grid grid-cols-3 rounded-box w-full mt-2 p-1">
                            {this.props.suggestions.map((suggestion, index) => {
                                return <div className="btn btn-ghost justify-start text-base-content"
                                            onClick={() => this.setPrimaryInput({type: suggestion, value: suggestion})}
                                            key={index}>
                                            {suggestion}
                                        </div> 
                            })}
                            </div>
                            :
                            ""
                        }
                    </div>
                </div>
            </div>
        )
    }
}
SearchBar.defaultProps = {
    invert: false,
    suggestions: searchSuggestions,
}

export class StdSearchBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            expanded: false,
            inputClasses: "SearchFieldGroup",
            showToolTip: false,
            searchQuery: "",
            selectedTag: "",
            tagType: "",
            suggestions: this.props.suggestions,
            placeholder: "",
        }
        this.searchInput = React.createRef();
        this.toggle = this.toggle.bind(this);
        this.focus = this.focus.bind(this);
        this.toggleToolTip = this.toggleToolTip.bind(this);
        this.searchCallBack = this.searchCallBack.bind(this);
        this.handleKeydown = this.handleKeydown.bind(this);
        this.state.expanded = this.props.persist ? true : false;
        this.state.inputClasses = this.props.persist ? "SearchFieldGroup if-active" : "SearchFieldGroup";
    }

    componentDidUpdate(prevProps) {
        if (prevProps.persist !== this.props.persist) {
            this.updateAndNotify();
        }
    }

    focus() {
        if (!this.props.persist) {
            this.searchInput.current.focus()
        }
    }

    updateAndNotify() {
        this.setState({
            expanded: true,
            inputClasses: "SearchFieldGroup if-active"
        })
    }

    toggleToolTip = (e) => {
        e.stopPropagation()
        if (this.props.toolTip !== null) {

            this.setState({
                showToolTip: !this.state.showToolTip
            })
        }
    }
    toggle() {
        this.props.onClick();

        if (this.props.persist) {
            this.searchInput.current.focus();
            return;
        } else {

            if (this.state.expanded) {
                this.setState({
                    expanded: false,
                    inputClasses: "SearchFieldGroup"
                })
            } else {
                this.setState({
                    expanded: true,
                    inputClasses: "SearchFieldGroup if-active"
                })
                this.searchInput.current.focus();
            }
        }

    }

    setSearch(option) {
        this.searchInput.current.value = option;
    }

    handleSearchQueryChange = (e) => {
        console.log(e.target.value);
        this.setState({
            searchQuery: e.target.value
        })
        this.props.searchChangeCallBack(e.target.value);
    }

    handleKeydown = (e, tag) => {
        if (e.key === "Enter") {
            this.searchCallBack(tag);
        }
    }

    searchCallBack(query) {
        this.props.searchCallBack(query);
    }

    render() {

        return (
            <div className={this.props.className}>
                <div className={"flex items-center justify-end"}>
                    <div className="searchBar">
                        <SearchButton onClick={this.toggle} className={this.props.invert ? "invert" : ""} hasToolTip={false} icon={<i className="bi bi-search"></i>}></SearchButton>
                    </div>
                    <div className={"flex items-center " + this.state.inputClasses} onAnimationEnd={this.focus}>
                        <input type={"text"} className={"SearchField"} placeholder={this.state.placeholder} ref={this.searchInput} onChange={this.handleSearchQueryChange} onKeyDown={(e) => this.handleKeydown(e, { type: this.state.tagType, value: this.state.selectedTag + "(" + this.searchInput.current.value + ")" })}></input>

                        {this.props.children}
                    </div>
                </div>
            </div>
        )
    }
}
StdSearchBar.defaultProps = {
    suggestions: [],
}


export class SearchButton extends React.Component {
    render() {
        return (
            <button className={"btn btn-square btn-ghost hover:text-accent"} onClick={this.props.onClick} style={{ width: this.props.size, height: this.props.size }} onMouseEnter={this.props.onMouseEnter} onMouseLeave={this.props.onMouseLeave}>
                {this.props.icon}
            </button>
        )
    }
}
SearchButton.defaultProps = {
    size: "56px",
}

export class Hamburger extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            toggled: false,
            classList: "ham hamRotate ham1",
        }
        this.toggle = this.toggle.bind(this);
        this.handleUpdate = this.handleUpdate.bind(this);
    }

    componentDidUpdate(prevProps) {
        if (prevProps.show !== this.props.show) {

            this.handleUpdate(this.props.show);
        }
    }

    handleUpdate(show) {
        if (show) {
            this.setState({
                classList: "ham hamRotate ham1 active",
                toggled: !this.state.toggled
            }
            )
        } else {
            this.setState({
                classList: "ham hamRotate ham1 ",
                toggled: !this.state.toggled
            }
            )
        }
    }

    toggle = () => {
        this.props.onClick();
        if (this.state.toggled) {
            this.setState({
                classList: "ham hamRotate ham1 ",
                toggled: !this.state.toggled
            }
            )
        } else {
            this.props.onClick()
            this.setState({
                classList: "ham hamRotate ham1 active",
                toggled: !this.state.toggled
            }
            )
        }
    }

    render() {

        return (
            <div className={this.props.className} onClick={this.toggle}>

                <svg className={this.state.classList} viewBox="0 0 100 100" width={this.props.size} height={this.props.size}>
                    <path
                        className="line top"
                        d="m 30,33 h 40 c 0,0 9.044436,-0.654587 9.044436,-8.508902 0,-7.854315 -8.024349,-11.958003 -14.89975,-10.85914 -6.875401,1.098863 -13.637059,4.171617 -13.637059,16.368042 v 40" />
                    <path
                        className="line middle"
                        d="m 30,50 h 40" />
                    <path
                        className="line bottom"
                        d="m 30,67 h 40 c 12.796276,0 15.357889,-11.717785 15.357889,-26.851538 0,-15.133752 -4.786586,-27.274118 -16.667516,-27.274118 -11.88093,0 -18.499247,6.994427 -18.435284,17.125656 l 0.252538,40" />
                </svg>
                {this.props.children}
            </div>
        )
    }
}

Hamburger.defaultProps = {
    size: "56px",
}

export class ActionsButton extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            classList: "actionsMenuToggle",
            actionsMenuClass: "actionsMenu",
            toggled: false,
        }
        this.toggle = this.toggle.bind(this);
    }
    toggle = () => {
        this.props.onClick()
        if (this.state.toggled) {
            this.setState({
                classList: "actionsMenuToggle ",
                actionsMenuClass: "actionsMenu",
                toggled: !this.state.toggled
            }
            )
        } else {
            this.props.onClick()
            this.setState({
                classList: "actionsMenuToggle active ",
                actionsMenuClass: "actionsMenu showActions",
                toggled: !this.state.toggled
            }
            )
        }
    }

    render() {
        return (
            <div className={" " + this.props.className} title={"Actions"} style={this.props.style} onClick={this.toggle}>

                <div className={this.state.classList + " text-center"}>
                    <i className="bi bi-grid-3x3-gap-fill"></i>
                </div>
                <div className={this.state.actionsMenuClass}>

                    {this.props.children}
                </div>
            </div>
        )
    }
}

ActionsButton.defaultProps = {
    size: "32px",
}
export class IconButton extends React.Component {
    render() {
        return (
            
            <button className={"btn btn-ghost btn-square  hover:text-accent"} onClick={this.props.onClick} title={this.props.title}>
                {this.props.icon}
            </button>
        )
    }
}
export class IconButtonAsLink extends React.Component {
    render() {
        return (
            <Link className={"btn btn-ghost btn-square hover:text-accent"} to={this.props.to} onClick={this.props.onClick} title={this.props.title}>
                {this.props.icon}
            </Link>
        )
    }
}
export class IconButtonWithText extends React.Component {
    render() {
        return (
            <button className={"btn btn-ghost gap-2 " + this.props.className} onClick={this.props.onClick}>
                <div>
                    {this.props.icon}
                </div>
                {this.props.label}
            </button>
        )
    }
}

export class SearchTags extends React.Component {

    onEditClick = (e) => {
        e.preventDefault();
        this.props.onEditClick();
    }

    onCancelClick = (e) => {
        e.preventDefault();
        this.props.onCancelClick();
    }

    render() {

        return (

        <div className={"btn btn-accent flex items-center swap-off gap-4"}>
            {this.props.children}
            <i className="bi bi-x-circle" onClick={(e)=>this.onCancelClick(e)}></i>
        </div>
        )
    }
}

SearchTags.defaultProps = {
    showRemove: true,
}

export class TagsBox extends React.Component {
    componentDidMount() {
    }

    render() {
        if (React.Children.count(this.props.children) === 0) {
            return (
                <div className={"flex items-center tagsBox flex-wrap justify-start " + this.props.className} onClick={this.props.onClick}>
                    <h1>No Tags yet</h1>
                </div>
            )
        }
        
        return (
           
            <div className={"flex gap-4"} >
                {this.props.showlabel &&
                <div class="dropdown dropdown-bottom">
                    <label tabindex="0" className="btn btn-ghost swap-off">Search Tags:</label>
                    <div tabindex="0" class="dropdown-content menu p-2 shadow bg-base-100 mt-2 rounded-box w-52">
                        <button className="btn btn-ghost" onClick={this.props.deleteAllTags}>Clear Tags</button>
                    </div>
                </div>
                }
                {this.props.children}
            </div>
        )
    }
}

TagsBox.defaultProps = {
    className: "",
    truncate: false,
    showlabel: false,
    enableDeleteAll: false,
    onClick: () => { }
}

//A beautiful checkbox
export class CheckBox extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            checked: this.props.checked,
            className: "checkbox"
        }
        this.toggle = this.toggle.bind(this);
    }
    toggle = () => {
        this.setState({
            checked: !this.state.checked,
            className: this.state.checked ? "checkbox" : "checkbox checked"
        })
        this.props.onClick();
    }
    render() {
        return (
            <div className={this.state.className} onClick={this.toggle}>
                <div className="checkbox-icon">
                    <i className="bi bi-check"></i>
                </div>
            </div>
        )
    }
}

export class StdButton extends React.Component {
    handleClick = (e) => {
        this.props.onClick();
    }


    render() {


        return (
            <button
                className={"btn " + this.props.style}
                onClick={this.handleClick}
                disabled={this.props.disabled}
                onAnimationEnd={this.reset}
                type={this.props.type}
                ref={this.btnRef}>
                {this.props.children}
            </button>
        )
    }

}
StdButton.defaultProps = {
    disabled: false,
}

export class MultiStepBox extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentStep: this.props.currentStep,
            progression: 0,
        }
        this.nextStep = this.nextStep.bind(this);
        this.prevStep = this.prevStep.bind(this);
        this.setStep = this.setStep.bind(this);
    }

    nextStep() {
        this.setState({
            currentStep: this.props.currentStep + 1,
        })
    }

    prevStep() {
        this.setState({
            currentStep: this.props.currentStep - 1,
        })
    }

    setStep(e) {
        this.setState({
            currentStep: e
        })
    }


    
    componentDidUpdate(prevProps, prevState){
        if(prevProps.currentStep !== this.props.currentStep){
            this.setState({
                currentStep: this.props.currentStep
            })
        }
    }  

    render() {
        return (
            <div className="w-full">
                {this.props.children.map((child, index) => {
                    if (React.isValidElement(child) && index === this.state.currentStep) {
                        return (
                            <div key={index} className={"step w-full " + (index === this.state.currentStep ? "active" : "")}>
                                {React.cloneElement(child, { nextStep: this.nextStep, prevStep: this.prevStep, setStep: this.setStep })}
                            </div>
                        )
                    } else {
                        return <div key={index} className={"step i w-full " + (index === this.state.currentStep ? "active" : "")} nextStep={this.nextStep} prevStep={this.prevStep} setStep={this.setStep}>
                        </div>
                    }
                })}
            </div>
        )
    }
}

export class Stepv2 extends React.Component {
    render(){
        if(this.props.step){
            return(
                this.props.children
            )
        }else{
            return null
        }
    }
}


export class Step extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentStep: this.props.currentStep
        }
    }

    render() {
        return (
            <div className={"step " + (this.props.currentStep === this.props.step? "active" : "")}>
                {this.props.children}
            </div>
        )
    }
}

export class ListMapper extends React.Component{

    addLink = (a,b) =>{
        const aKey = this.props.settings.tableHeaders[0]
        const bKey = this.props.settings.tableHeaders[1]
        const itemToAdd = {}
        itemToAdd[aKey] = a
        itemToAdd[bKey] = b
        console.log(a,b);
        this.props.addLink(itemToAdd);
        this.props.requestRefresh();
    }

    deleteLink = (a,b) =>{
        const aKey = this.props.settings.tableHeaders[0]
        const bKey = this.props.settings.tableHeaders[1]
        const itemToDelete = {}
        itemToDelete[aKey] = a;
        itemToDelete[bKey] = b;
        console.log(a,b);
        this.props.deleteLink(itemToDelete);
        this.props.requestRefresh();
    }

    render(){
        return(
            <div className="listMapper">
                <div className="listMapper-header">{this.props.title}</div>
                <div className="listMapper-Selector">
                    {this.props.data?
                    
                    this.props.data.map((item, index) => {
                        return (
                            <ListMapperItem currItem = {this.props.currItemID} addLink={this.addLink} deleteLink={this.deleteLink} key={index} currentMap={this.props.currentMap} item={item} headers = {this.props.headers} settings={this.props.settings}></ListMapperItem>
                        )
                    }): ""}
                </div>
            </div>
        )
    }
}

export class ListMapperItem extends React.Component{
    render(){
        return(
            this.props.currentMap.some((item) => item[this.props.settings.matchingHeaders[0]] === this.props.item[this.props.settings.matchingHeaders[1]]) ? 
                <div className="listMapperItem active"  onClick={()=>this.props.deleteLink(this.props.item[this.props.settings.matchingHeaders[1]],this.props.currItem)}>
                {Object.keys(this.props.headers).map((key, index) => {
                    if(!this.props.headers[key].primaryKey && !this.props.headers[key].foreignKey ){
                        
                    return (
                        this.props.item[key] + " "
                    )
                    }
                    return "";
                })}
            </div>
            : 
            
            <div className="listMapperItem" onClick={()=>this.props.addLink(this.props.item[this.props.settings.matchingHeaders[1]],this.props.currItem,)}>
                {Object.keys(this.props.headers).map((key, index) => {
                    if(!this.props.headers[key].primaryKey && !this.props.headers[key].foreignKey ){
                        
                    return (
                        this.props.item[key] + " "
                    )
                    }
                    return "";
                })}
            </div>
        )
    }
}

export class ListMapperView extends React.Component{
    render(){
        return(
            <div className="listMapper">
                <div className="listMapper-header">{this.props.title}</div>
                <div className="listMapper-Selector">
                    {this.props.data?
                    this.props.data.map((item, index) => {
                        return (
                            <ListMapperViewItem key={index} item={item} headers = {this.props.headers} settings={this.props.settings}></ListMapperViewItem>
                        )
                    }): ""}
                </div>
            </div>
        )
    }
}

export class ListMapperViewItem extends React.Component{
    render(){
        return(
            <div className="listMapperItem active">
                {Object.keys(this.props.headers).map((key, index) => {
                    if(!this.props.headers[key].primaryKey && !this.props.headers[key].foreignKey ){
                        
                    return (
                        this.props.item[key] + " "
                    )
                    }
                    return "";
                })}
            </div>
        )
    }
}

const steps = {
    0: "month",
    1: "week",
    2: "day",
}

export class CalendarView extends React.Component{

    state={
        month: moment(new Date()).format("MM"),
    }

    nextMonth = () =>{
        this.setState({
            month: moment(this.state.month, "MM").add(1, "month").format("MM")
        })
    }

    prevMonth = () =>{
        this.setState({
            month: moment(this.state.month, "MM").subtract(1, "month").format("MM")
        })
    }

    componentDidMount(){
    }

    render(){
        return (
            <MultiStepBox steps={steps} currentStep={0}>
                <MonthView month = {this.state.month} nextMonth={this.nextMonth} prevMonth={this.prevMonth}>
                </MonthView>
                <WeekView>
                </WeekView>
                <DayView>
                </DayView>
            </MultiStepBox>
        )
    }
}

export class MonthView extends React.Component{
    state={
        calendar:[],
        currentMonth: moment(),
        loading:true,
    }

    componentDidMount(){
        const days = this.generateCalendar();
        console.log(days);
        this.setState({
            calendar: days,
            loading:false,
        })
    }

    generateCalendar = () =>{
        
        const startDay = this.state.currentMonth.clone().startOf('month').startOf('week');
        const endDay = this.state.currentMonth.clone().endOf('month').endOf('week');

        var calendar = [];
        var index = startDay.clone();
        while (index.isBefore(endDay, 'day')) {
            calendar.push(
                new Array(7).fill(0).map(
                    function(n, i) {
                        return {
                            date: index.add(1, 'day').date(), 
                            fullDateFormat: index.format("YYYY-MM-DD"), 
                            month: index.format("MM"),
                            day: index.format("DD"), 
                            year: index.format("YYYY"), 
                            dayOfWeek: index.format("ddd")
                        }
                    }
                )
            );
        }
        return calendar;
    }

    nextMonth = () =>{
        this.setState({
            currentMonth: this.state.currentMonth.add(1, "month")
        })
        var days = this.generateCalendar();
        this.setState({
            calendar: days
        })
        
        this.props.nextMonth();
    }

    prevMonth = () =>{
        this.setState({
            currentMonth: this.state.currentMonth.subtract(1, "month")
        })
        var days = this.generateCalendar();
        this.setState({
            calendar: days
        })
        this.props.prevMonth();
    }

    render(){
        return(
            this.state.loading ? 
            <Loading></Loading>
            :
            <div className="monthView">
                <div className="monthView-header">
                    <IconButton className={"invert"} icon={<i className="bi bi-chevron-double-left"></i>} onClick={this.prevMonth}></IconButton>
                    {moment(this.state.currentMonth).format("MMMM YYYY")}
                    <IconButton className={"invert"} icon={<i className="bi bi-chevron-double-right"></i>} onClick={this.nextMonth}></IconButton>
                </div>
                <div className="monthView-calendar">
                    <div className="monthView-daysHeader">
                    {this.state.calendar[0].map((day, index) => {
                            return (
                                <div key={"d-" + index} className={"monthView-dayHeader " + (moment(day.fullDateFormat,"DD-MM-YYYY").format("DD-MM-YYYY") == moment(new Date()).format("DD-MM-YYYY") ? "active" : "")}>
                                    <span className="day">{day.dayOfWeek}</span>
                                </div>
                            )
                        })}

                    </div>
                    <div className="monthView-days">
                        {this.state.calendar.map((week, index) => {
                            return (
                                <div className="monthView-week" key={"w-" + index}>
                                    {week.map((day, index) => {
                                        return (
                                            this.props.cellComponent ? 
                                            
                                            <div className="monthView-day" key={"d-" + index}>
                                                {React.cloneElement(this.props.cellComponent, {
                                                    index: day.fullDateFormat , key: "d-" + index,
                                                    currentMonth: this.state.currentMonth.clone().format("MM"),
                                                })}                                               
                                            </div>    
                                            :
                                            
                                            <div className="monthView-day" key={"d-" + index}>
                                                {day.date}
                                            </div>
                                        )
                                    })}
                                    </div>
                            )})}
                    </div>
                </div>
            </div>
        )
    }
}

export class WeekView extends React.Component{
    state={
        calendar:[],
        currentWeek: moment(),
        timeSlots: [],
        nextCounts: 0,
    }
    componentDidMount(){
        const days = this.generateCalendar();
        
        const timeSlots = []

        var startTime = moment(this.props.startTime, "HH:mm");

        var endTime = moment(this.props.endTime, "HH:mm");

        while (startTime.isBefore(endTime)) {
            timeSlots.push({
                time: startTime.format("HH:mm"),
                event: [],
            });
            startTime.add(this.props.increments, "minutes");
        }

        this.setState({
            calendar: days,
            timeSlots: timeSlots
        })
    }

    generateCalendar = () =>{
        const startDay = this.state.currentWeek.clone().startOf("week").subtract(1,"day");

        var calendar = [];
        var index = startDay.clone();
            calendar = 
                new Array(7).fill(0).map(
                    function(n, i) {
                        return {date: index.add(1, 'day').format("D"), day: index.format("ddd"), month: index.format("MM"), fullDateFormat: index.format("DD-MM-YYYY")};
                    }
                );
        if(this.props.initCalendar){
            this.props.initCalendar(calendar);
        }
        return calendar;
    }

    nextWeek = () =>{
        if(this.props.maxNext){
            var counts = this.state.currentWeek.clone().startOf("week").diff(moment().startOf("week"), "week");
            console.log(counts);
            if(counts < this.props.maxNext){
                this.setState({
                    currentWeek: this.state.currentWeek.add(1, "week"),
                })
                var days = this.generateCalendar();
                this.setState({
                    calendar: days
                })
                
                if(this.props.nextWeek){
                    this.props.nextWeek(days);
                }
            }
        }else{
            this.setState({
                currentWeek: this.state.currentWeek.add(1, "week"),
            })
            var days = this.generateCalendar();
            this.setState({
                calendar: days
            })
            
            if(this.props.nextWeek){
                this.props.nextWeek(days);
            }
        }
    }

    prevWeek = () =>{

        if(this.props.maxPrev){
            var counts = this.state.currentWeek.startOf("week").diff(moment().startOf("week"), "week") * -1;
            console.log(counts);
            if(counts < this.props.maxNext){
                this.setState({
                    currentWeek: this.state.currentWeek.subtract(1, "week")
                })
                var days = this.generateCalendar();
                this.setState({
                    calendar: days
                })
                if(this.props.prevWeek){
                    this.props.prevWeek(days);
                };
            }
        }else{
            this.setState({
                currentWeek: this.state.currentWeek.subtract(1, "week")
            })
            var days = this.generateCalendar();
            this.setState({
                calendar: days
            })
            if(this.props.prevWeek){
                this.props.prevWeek(days);
            };
        }
    }

    handleScroll = (e) => {
        console.log(e.target.scrollTop);
        this.refs["dateHeader"].scrollLeft = e.target.scrollLeft;
        
    }



    render(){
        return(
            <div className="weekView">
                <div className="weekView-header">
                    <IconButton className={"invert"} icon={<i className="bi bi-chevron-double-left"></i>} onClick={this.prevWeek}></IconButton>
                    {this.state.currentWeek.clone().startOf('week').format("DD MMMM") + " - " + this.state.currentWeek.clone().endOf('week').format("DD MMMM")}
                    <IconButton className={"invert"} icon={<i className="bi bi-chevron-double-right"></i>} onClick={this.nextWeek}></IconButton>
                </div>
                <div className="weekView-week-container">
                    <div className="weekView-calendar" style={
                        this.props.maxSlots != "MAX" ?{"--maxRow": this.props.maxTimeSlot}:{
                            "height": "auto"
                        }
                    }>
                        <div className="weekView-weekDays" style={{"--rows": this.state.calendar.length + 1}} ref={"dateHeader"}>
                            <div className="spacer"></div>
                            {this.state.calendar.map((day, index) => {
                                return (
                                    <div key={"d-" + index} className={"weekView-day " + (moment(day.fullDateFormat,"DD-MM-YYYY").format("DD-MM-YYYY") == moment(new Date()).format("DD-MM-YYYY") ? "active" : "")}>
                                        <span className="day">{day.day}</span>
                                        {this.props.showDate && <span className="date">{day.date}</span>}
                                    </div>
                                )
                            })}
                        </div>
                        <div className="weekView-timeHeader" style={{"--columns" : this.state.timeSlots.length}}>
                        {this.state.timeSlots.map((timeSlot, index) => {
                            return (
                                <div className="timeSlot" key={"t-head-" + index}>{timeSlot.time}</div>
                            )
                        })}
                        </div>
                        <div className="weekView-days" style={{"--columns" : this.state.calendar.length}} onScroll={this.handleScroll}>
                            {this.state.calendar.map((day, dIndex) => {
                                return (
                                    <div className="weekView-day" style={{"--columns" : this.state.timeSlots.length}} key={"d-" + dIndex}>
                                        {this.state.timeSlots.map((timeSlot, tIndex) => {
                                        return (
                                            <div className="weekView-timeSlot" key={"d-"+ dIndex + "-t-" + tIndex}>
                                                {this.props.cellComponent ? 
                                                
                                                React.cloneElement(this.props.cellComponent, {
                                                    index: moment(day.fullDateFormat + " " + timeSlot.time, "DD-MM-YYYY HH:mm").format("DD-MM-YYYY HH:mm"),
                                                }) :
                                                
                                                <div className="event">-</div>
                                                }
                                            </div>
                                        )
                                    })}
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

WeekView.defaultProps = {
    startTime: "08:00",
    endTime: "21:00",
    increments: 30,
}

export class DayView extends React.Component{
    render(){
        return(
            <div className="monthView">
                <div className="monthView-header">
                    <div className="monthView-header-item">Month</div>
                    <div className="monthView-header-item">Week</div>
                    <div className="monthView-header-item">Day</div>
                </div>
                <div className="monthView-body">
                    <div className="monthView-body-item">Month</div>
                    <div className="monthView-body-item">Week</div>
                    <div className="monthView-body-item">Day</div>
                </div>
            </div>
        )
    }
}

export class Shimmer extends React.Component{
    state={
        shimmerType : "content-line "
    }
    componentDidMount(){
        switch(this.props.type){
            case "content":
                this.setState({
                    shimmerType: "content-line "
                });
                break;
            case "title":
                this.setState({
                    shimmerType: "title-line "
                });
                break;
        }
    }
    render(){
        return(
            <div className={
                "shimmer " + 
                this.state.shimmerType + 
                (this.props.end ? "end ": "") +
                (this.props.noPadding ? "no-padding ": "")
            } style={{
                "--maxWidth": this.props.maxWidth,
                "--maxHeight": this.props.maxHeight,
                "--minWidth": this.props.minWidth,
                "--minHeight": this.props.minHeight,
            }}></div>
        )
    }
}


export class AddEntry extends React.Component{
    state = {
        courseToAdd: {},
    }

    onChange = (field, value) => {
        var tempCourse = this.state.courseToAdd;
        tempCourse[field] = value;
        this.setState({
            courseToAdd: tempCourse
        })
    }

    uploadFile = async (file) => {
        console.log(file);
        const formData = new FormData();
        formData.append("file", file.FileUrl);
        
        return await fetch("/api/File/Upload",
            {
                method: "POST",
                body: formData,
            }
        ).then((res) => {
            console.log(res);
            return res.json();
        }).catch(err => {
            console.log(err);
        })
    }

    createCourse = async (courseToAdd) => {

        return fetch(this.props.settings.api + "Create", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(courseToAdd),
        }).then((res => {
            return res.json();
        })).catch((err) => {
            console.log(err);
        })
    }

    handleCourseCreation = async (e) => {
        e.preventDefault();
        var courseToAdd = this.state.courseToAdd;
        var fileUploadFields = [];
        
        for(const field of Object.keys(this.props.fieldSettings)){
            if (this.props.fieldSettings[field].type === "file") {
                fileUploadFields.push(field);
            }
        }

        for(const field of fileUploadFields){
            try {
                const res = await this.uploadFile(courseToAdd[field]);
                if(res.success){
                    courseToAdd[field] = res.data;
                }
            }catch(e){
                this.props.requestError(e);
            }
        }
        try {
            const res = await this.createCourse(courseToAdd);
            if(res.success){
                this.props.requestRefresh();
            }else{
                this.props.requestError(res.message);
            }
        }catch(e){
            this.props.requestError(e);
        }
    }

    render(){
        return (
            <div className="container addEntry">
                <form className={"grid md:grid-cols-2 grid-cols-1 gap-4"} onSubmit={this.handleCourseCreation}>
                    {Object.keys(this.props.fieldSettings).map(
                    (key, index) => {
                        return (this.props.fieldSettings[key].primaryKey? "" : 
                            <StdInput 
                            label = {this.props.fieldSettings[key].displayLabel}
                            type={this.props.fieldSettings[key].type}
                            enabled = {true}
                            fieldLabel={key}
                            onChange = {this.onChange}
                            options={this.props.fieldSettings[key].options}
                            dateFormat = {this.props.fieldSettings[key].dateFormat}
                            allowEmpty = {true}
                            toolTip = {this.props.fieldSettings[key].toolTip}
                            >
                            </StdInput>)
                    }
                )}
                <StdButton style={"md:col-span-2"} type={"submit"}>Submit</StdButton>
                </form>
                </div>
        )
    }
}

export class DeleteEntry extends React.Component{
    state = {
        courseToDelete: {},
    }

    onChange = (field, value) => {
        var tempCourse = this.state.courseToDelete;
        tempCourse[field] = value;
        this.setState({
            courseToDelete: tempCourse
        })
    }

    deleteCourse = async (courseToDelete) => {
        console.log(courseToDelete);
        return fetch(this.props.settings.api + "Delete", {
            method: "Delete",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(courseToDelete),
        }).then((res => {
            return res.json();
        }));
    }

    handleCourseDeletion = async (e) => {
        e.preventDefault();
        await this.deleteCourse(this.state.courseToDelete).then((content) => {
            if(content.success){
                this.props.requestRefresh();
            }else{
                this.props.requestError(content.message);
            }
        })
    }

    render(){
        return (
            <div className="container flex justify-center">
                <form className="w-96 flex flex-col gap-4" onSubmit={this.handleCourseDeletion}>
                {Object.keys(this.props.fieldSettings).map(
                    (key, index) => {
                        return (this.props.fieldSettings[key].primaryKey? 
                            <StdInput 
                            label = {this.props.fieldSettings[key].displayLabel}
                            type={"text"}
                            enabled = {true}
                            fieldLabel={key}
                            onChange = {this.onChange}
                            options={this.props.fieldSettings[key].options}
                            dateFormat = {this.props.fieldSettings[key].dateFormat}
                            >
                            </StdInput> : "")
                    }
                )}
                <StdButton style={"w-full"} type={"submit"}>Submit</StdButton>
            
                </form>
            </div>
        )
    }
}


export class GenerateSpreadsheet extends React.Component{
    state={
        columns: [],
        spreadsheetReady: false,
    }
    
    componentDidMount(){
        let columns = [];
        for(var i = 0; i < Object.keys(this.props.fieldSettings).length; i++){
            columns.push(
                {
                    label: Object.keys(this.props.fieldSettings)[i],
                    key: Object.keys(this.props.fieldSettings)[i],
                }
            );
        }
        this.setState({
            columns: columns
        });
    }

    reOrderColumns = (index, direction) => {
        var tempColumns = this.state.columns;
        if(direction === "up"){
            if(index > 0){
                var temp = tempColumns[index];
                tempColumns[index] = tempColumns[index - 1];
                tempColumns[index - 1] = temp;
            }
        } else {
            if(index < tempColumns.length - 1){
                var temp = tempColumns[index];
                tempColumns[index] = tempColumns[index + 1];
                tempColumns[index + 1] = temp;
            }
        }
        this.setState({
            columns: tempColumns
        });
    }

    generateSpreadsheet = () =>{
        this.setState({
            spreadsheetReady : false
        })

        // Fake loading time to show false sense of progress
        setTimeout(() => {
            this.setState({
                spreadsheetReady : true
            })}, 1000);
    }

    render(){
        return (
            <div className="container generate-spreadsheet">
                <div className="column-order">
                    {this.state.columns.map((column, index) => {
                        return <div className="column">
                            <div className="column-order-buttons">
                                <IconButton className={"invert"} icon={<i className="bi bi-arrow-up"></i>} onClick={() => this.reOrderColumns(index, "up")}></IconButton>
                                <IconButton className={"invert"} icon={<i className="bi bi-arrow-down"></i>} onClick={() => this.reOrderColumns(index, "down")}></IconButton>
                            </div>
                            <div className="column-name">{column.label}</div>
                        </div>
                    })}     
                </div>
                <div className="generate-actions">
                    <StdButton onClick={() => this.generateSpreadsheet()}>
                        Generate Spreadsheet
                    </StdButton>

                    {this.state.spreadsheetReady ?
                    
                    <CSVLink data={this.props.data} className={"forget-password"} headers={this.state.columns} filename={this.props.settings.title + ".csv"}>Download</CSVLink>
                    :
                    <div className="spinner-border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    }    
                </div>
            </div>
        )
    }

    
}
