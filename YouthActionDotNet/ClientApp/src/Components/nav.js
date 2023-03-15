import React from "react";
import { NavLink } from "react-router-dom";
import { Link , useNavigate} from 'react-router-dom'
import { Hamburger, IconButton,IconButtonAsLink } from "./common";
import placeholderUser from "../Assets/placeholderUser.png"
import { ListTile } from "../Pages/DefaultPage";

export default class Nav extends React.Component {
    render() {
        return (
            <div className={"w-full navbar flex justify-between items-center"}>
                <div className="flex-none lg:hidden">
                    <label htmlFor="main-drawer" className="btn btn-square btn-ghost">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-6 h-6 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
                    </label>
                </div> 
                <a className="btn btn-ghost" to={"/"}>
                    {this.props.title}
                </a>
                <UserPanel user={this.props.user}></UserPanel>
            </div>
        )
    }
}
Nav.defaultProps = {
    classes : ""
}

export class UserPanel extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            showUserDetail: true,
        }
        this.routeChange = this.routeChange.bind(this);
    }
    componentDidMount() {

        window.addEventListener("resize", this.resize.bind(this));
        this.resize();
    }

    routeChange=(e)=> {
        let path = e;
      }
    

    resize() {
        if (window.innerWidth <= 760) {
            this.setState({
                showUserDetail: false
            })
        } else {
            this.setState({
                showUserDetail: true
            })
        }
    }

    render() {
        return (
            <div className={"flex items-center"}>
                {this.state.showUserDetail &&
                <IconButtonAsLink to={"/"} className={"invert"} icon={<i className="bi bi-house"></i>}></IconButtonAsLink>
                }
                {this.state.showUserDetail && 
                <IconButtonAsLink to={"/Logout"} className={"invert"} onClick={this.routeChange("/Logout")} icon={<i className="bi bi-box-arrow-left"></i>}></IconButtonAsLink>
                }
                {this.state.showUserDetail ? <ListTile leading={<img src={placeholderUser} width={"32px"}></img>} title={<span className="m-0">{this.props.user? this.props.user.username : ""}</span>}>

                </ListTile> : <ListTile leading={<img src={placeholderUser} width={"32px"}></img>}>

                </ListTile>}
            </div>
        )
    }
}

export class NaviLink extends React.Component {
    render() {
        return (
            <li className="nav-item">
                <NavLink className={(navData) => (navData.isActive ? "active nav-link" : "nav-link")} to={this.props.to}>{this.props.title}</NavLink>
            </li>
        )
    }
}

export class DisabledLink extends React.Component {
    render() {
        return (

            <li className="nav-item">
                <Link className={"nav-link disabled"} to="/" tabindex="-1" aria-disabled="true">Disabled</Link>
            </li>
        )
    }
}

export class DropDownLink extends React.Component {
    render() {
        return (
            <li className="nav-item dropdown">
                <a className="nav-link dropdown-toggle" onClick={this.props.onClick} href={this.props.to} id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                    {this.props.title}
                </a>
                <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                    {this.props.children}
                </ul>
            </li>
        )
    }
}

export class DropDownItem extends React.Component {
    render() {
        return (
            <li><NavLink className={(navData) => (navData.isActive ? "active dropdown-item" : "dropdown-item")} to={this.props.to}>{this.props.title}</NavLink></li>
        )
    }
}

export class DarkModeToggle extends React.Component {
    state = {
        isChecked: false
    }

    toggleChange = e => {
        if (this.state.isChecked) {
            sessionStorage.setItem("DarkMode", false)
            this.setState({
                isChecked: false
            })
        } else {

            sessionStorage.setItem("DarkMode", true)
            this.setState({
                isChecked: true
            })
        }
    }
    render() {
        return (
            <input type="checkbox" checked={this.state.isChecked} onChange={this.toggleChange
            }>
            </input >
        )
    }
}