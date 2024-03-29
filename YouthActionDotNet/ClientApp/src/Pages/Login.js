import React from "react";
import PropTypes from 'prop-types';
import { MultiStepBox, StdButton} from "../Components/common";
import { StdInput } from "../Components/input";

import museLogo from "../Assets/MUSE.png";

const loginSteps = {0: "login", 1: "register",2: "forgot"}


async function loginUser(credentials) {
  return fetch('/api/User/Login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(credentials)
  }).then(function (res) { return res.json(); })
}


async function registerUser(credentials){
  return fetch('/api/User/Create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(credentials)
  }).then(function (res) { 
    return res.json(); 
  })
}

async function getPermissions(token){
  var role = token.data.Role;
  if(role === "Employee"){
    role = token.data.EmployeeRole;
  }
  return fetch( "/api/Permissions/GetPermissions/" + role , {
      method: "GET",
      headers: {
          "Content-Type": "application/json",
      },
  }).then(res => {
      console.log(res);
      return res.json();
  });
}

export default class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
      message: "",
      transform: "translateX(0%)",
      maxHeight: window.innerHeight
    }
    this.setPassword = this.setPassword.bind(this);
    this.setUsername = this.setUsername.bind(this);
    this.handleLogin = this.handleLogin.bind(this);
    this.handleRegister = this.handleRegister.bind(this);
    this.setStep = this.setStep.bind(this);
    window.addEventListener('resize', this.resize.bind(this));
  }

  resize = () => {
    this.setState({
      maxHeight: window.innerHeight
    })
  }

  setStep(e) {
    if (e === "fp") {
      if (window.innerWidth <= 576) {
        this.setState({
          transform: 'translateX(-100%)'
        })
      } else {
        this.setState({
          transform: 'translateX(-50%)'
        })
      }
    } else {

      if (window.innerWidth <= 576) {
        this.setState({
          transform: 'translateX(-0%)'
        })
      } else {
        this.setState({
          transform: 'translateX(-0%)'
        })
      }
    }
  }

  setUsername(field, value) {
    this.setState({
      username: value
    })
  }

  setPassword(field,value) {
    this.setState({
      password: value
    })
  }

  handleLogin = async e => {
    console.log(e,"Submitted")
    e.preventDefault();
    const token = await loginUser({
      username: this.state.username, Password: this.state.password
    });

    const permissions = await getPermissions(token);
    console.log(permissions)

    
    if(token.success){
      this.props.setToken(token);
      this.props.setPerms(permissions.data.Permission);
    }else{
      this.setState({
        message: token.message
      })
    }
  }

  handleRegister = async e => {
    console.log(e,"Submitted")
    e.preventDefault();
    const token = await registerUser({
      username: this.state.username, Password: this.state.password
    });

    if(token.success){
      console.log(token)
      this.props.setToken(token);
    }else{
      this.setState({
        message: token.message
      })
    }

  }

  render() {
    return (
      <div className="flex w-full h-full grow items-center justify-center overflow-y-clip">
        <div className="flex flex-col xl:flex-row xl:w-1/2 w-10/12 items-stretch border shadow rounded-lg bg-primary overflow-y-clip">
        <div className="xl:w-1/2 w-full relative xl:order-last flex justify-center self-center items-center flex-col h-full">
            {window.innerWidth >= 576 &&
              <ul class='circles'>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
              </ul>}
              
              <h1 className="text-white text-4xl font-bold">YouthAction</h1>
              <div className="logoContainer text-primary bg-transparent">
                {/* <img src={museLogo} alt="logo" /> */}
              </div>
              <div className="text-base-100">
                <h1>
                  Welcome Back!
                </h1>
              </div>
          </div>
          <div className="xl:w-1/2 w-full bg-base-100">
            <MultiStepBox steps={loginSteps} currentStep={0}>
              <LoginFormBox title={"Login"}
                handleSubmit={this.handleLogin}
                fields={[{
                  label: "Username",
                  type:"text",
                  onChange: this.setUsername,
                }, {
                  label: "Password",
                  type:"password",
                  onChange: this.setPassword,
                }]}
                actions={[{
                  label: "Submit",
                  type: "Submit",
                  onClick: null,
                }]}>
              </LoginFormBox>
              <RegisterFormBox title={"Register"}
                handleSubmit={this.handleRegister}
                fields={[{
                  label: "Username",
                  type:"text",
                  onChange: this.setUsername,
                }, {
                  label: "Password",
                  type:"password",
                  onChange: this.setPassword,
                }]}
                actions={[{
                  label: "Submit",
                  type: "Submit",
                  onClick: null,
                }]}>
              </RegisterFormBox>
              <ForgetPasswordFormBox title={"Forget Password"}
                handleSubmit={this.handleSubmit}
                fields={[{
                  label: "Email",
                  type:"email",
                  onChange: () => { },
                }]}
                actions={[{
                  label: "Submit",
                  type: "Submit",
                  onClick: null,
                }, {
                  label: "Submit",
                  type: "Submit",
                  onClick: null,
                }]}>
              </ForgetPasswordFormBox>
            </MultiStepBox>
          </div>
          
        </div>
        <div className={"modalMessage " + (this.state.message.length > 0 ? "show" : "")} onAnimationEnd={()=>this.setState({
          message: ""
        })}>
          {this.state.message}
        </div>
      </div>
    )
  }
}

Login.propTypes = {
  setToken: PropTypes.func.isRequired
}

export class LoginFormBox extends React.Component {
  render() {
    return (

      <div className="login-form">
        <div className="leftPanel-Title">
          <span>{this.props.title}</span>
        </div>
        <div className="divider"/>
        <form onSubmit={this.props.handleSubmit}>
          {this.props.fields.map((field, index) => {
            return (
              <StdInput 
                type={field.type} 
                key={index} 
                enabled={true} 
                showIndicator={false} 
                showSaveBtn={false} 
                label={field.label} 
                onChange={field.onChange}></StdInput>
            )
          })}
          <div className="row-cols-md-2 row-cols-1 loginActions">
            {this.props.actions.map((action, index) => {
              return (
                <StdButton key={index} type={action.type} style="primary w-full" onClick={action.onClick}>{action.label}</StdButton>)
            })}
          </div>
          <div onClick={()=>this.props.setStep(2)}><span className="forgetPassword" href="#">Forgot Password?</span></div>
          <div onClick={()=>this.props.setStep(1)}><span className="forgetPassword" href="#">Dont have an account?</span></div>
        </form>
        <div className="spacer">
        </div>
      </div>
    )
  }
}

export class RegisterFormBox extends React.Component {
  render() {
    return (

      <div className="login-form">
        <div className="leftPanel-Title">
          <span>{this.props.title}</span>
        </div>
        <div className="divider"/>
        <form onSubmit={this.props.handleSubmit}>
          {this.props.fields.map((field, index) => {
            return (
              <StdInput type={field.type} key={index} enabled={true} showIndicator={false} showSaveBtn={false} label={field.label} onChange={field.onChange}></StdInput>
            )
          })}
          <div className="row-cols-md-2 row-cols-1 loginActions">
            {this.props.actions.map((action, index) => {
              return (
                <StdButton key={index} type={action.type}  style="primary w-full" onClick={action.onClick}>{action.label}</StdButton>)
            })}
          </div>
          <div onClick={()=>this.props.setStep(0)}><span className="forgetPassword" href={"#"}>Already have an account?</span></div>
          <div onClick={()=>this.props.setStep(2)}><span className="forgetPassword" href={"#"}>Forgot Password?</span></div>
        </form>
        <div className="spacer">
        </div>
      </div>
    )
  }
}

export class ForgetPasswordFormBox extends React.Component {
  render() {
    return (

      <div className="login-form">
        <div className="leftPanel-Title">
          <span>{this.props.title}</span>
        </div>
        <div className="divider"/>
        <form onSubmit={this.props.handleSubmit}>
          {this.props.fields.map((field, index) => {
            return (
              <StdInput type={field.type} key={index} showIndicator={false} showSaveBtn={false} label={field.label} onChange={field.onChange}></StdInput>
            )
          })}
          <div className="flex flex-col gap-4">
            <StdButton type="button" onClick={()=>this.props.setStep(0)}  style="primary w-full">Back</StdButton>
            <StdButton type="button"  style="primary w-full">Submit</StdButton>
          </div>
          </form>
        <div className="spacer">
        </div>
      </div>
    )
  }
}