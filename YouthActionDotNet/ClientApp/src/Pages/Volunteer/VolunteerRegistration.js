import React from "react";
import { Loading } from "../../Components/appCommon";
import { MultiStepBox, StdButton } from "../../Components/common";
import { StdInput } from "../../Components/input";
import "../../styles/volunteer-registration.scss";

async function getPermissions(token) {
  var role = token.data.Role;
  if (role === "Employee") {
    role = token.data.EmployeeRole;
  }
  return fetch("/api/Permissions/GetPermissions/" + role, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  }).then((res) => {
    console.log(res);
    return res.json();
  });
}

export default class VolunteerRegistration extends React.Component {
  state = {
    loading: true,
    settings: {},
    excludes: [
      "UserId",
      "ApprovedBy",
      "ApprovalStatus",
      "Role",
      "VolunteerDateJoined",
    ],

    currStep: 0,

    steps: [
      {
        index: 0,
        title: "Login Information",
        fields: ["username", "Email", "Password"],
      },
      {
        index: 1,
        title: "Personal Information",
        fields: ["VolunteerNationalId", "VolunteerDateBirth"],
      },
      {
        index: 2,
        title: "Qualifications",
        fields: ["Qualifications", "CriminalHistory", "CriminalHistoryDesc"],
      },
    ],

    dataToPush: {},
    error: "",
  };

  async componentDidMount() {
    await this.getSettings().then((settings) => {
      console.log(settings.data);
      this.setState({
        settings: settings.data,
      });
    });

    this.setState({
      loading: false,
    });
  }

  getSettings = async () => {
    return await fetch("/api/Volunteer/Settings", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }).then((response) => {
      return response.json();
    });
  };

  register = async () => {
    return await fetch("/api/Volunteer/Register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(this.state.dataToPush),
    }).then((response) => {
      return response.json();
    });
  };

  validate = (currStep) => {
    const step = this.state.steps[currStep];
    for (var field of step.fields) {
      console.log(field);
      if (
        !this.state.dataToPush[field] ||
        this.state.dataToPush[field] === ""
      ) {
        console.log(step.index);
        this.setState({
          error: "Please fill out all fields",
        });
        return true;
      }
    }
    return false;
  };

  handleRegister = async () => {
    const token = await this.register();
    const perms = await getPermissions(token);
    if (token.success) {
      console.log(token);
      this.props.setToken(token);
      this.props.setPerms(perms.data.Permission);
    } else {
      console.log(token.message);
    }
  };

  onChange = (field, value) => {
    var dataToPush = this.state.dataToPush;
    dataToPush[field] = value;
    this.setState({
      dataToPush: dataToPush,
    });
  };

  next = () => {
    if (this.validate(this.state.currStep)) {
      return;
    }
    if (this.state.currStep != this.state.steps.length - 1) {
      this.setState({
        currStep: this.state.currStep + 1,
      });
    } else {
      this.handleRegister();
    }
  };

  render() {
    console.log("render");
    const steps = this.state.steps;
    const currStep = this.state.currStep;
    const dataToPush = this.state.dataToPush;

    const finalStep = currStep === steps.length - 1;

    return this.state.loading ? (
      <Loading></Loading>
    ) : (
      <div className="hero min-h-screen bg-base-200">
        <div className="hero-content flex-col lg:flex-row-reverse">
          <div className="text-center lg:text-left">
            <h1 className="text-5xl font-bold">Register</h1>
            <p className="py-6">Register as a volunteer here!</p>
          </div>
          <div className="card flex-shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
            <div className="card-body">
              <ul className="steps">
                {steps.map((step, index) => {
                  return (
                    <li
                      className={
                        index > currStep ? "step" : "step step-primary"
                      }
                      key={index}
                      onClick={() => {
                        if(this.validate(index)) return;
                        this.setState({
                            currStep: index,
                        });
                      }}
                    >
                      {step.title}
                    </li>
                  );
                })}
              </ul>

              <form
                className="flex flex-col"
                onSubmit={(e) => {
                  e.preventDefault();
                }}
              >
                {this.state.error !== "" ? (
                  <div className="alert alert-error shadow-lg">
                    <div>
                      <button
                        className="btn btn-ghost btn-square btn-sm float-right"
                        onClick={() => {
                          this.setState({
                            error: "",
                          });
                        }}
                      >
                        <i className="bi bi-x-circle"></i>
                      </button>
                      <span>{this.state.error}</span>
                    </div>
                  </div>
                ) : null}
                <MultiStepBox currentStep={currStep}>
                  {steps.map((step, index) => {
                    return (
                      <div className="grid grid-cols-1 gap-4" key={index}>
                        {step.fields.map((key, index) => {
                          const field = this.state.settings.FieldSettings[key];
                          const value = this.state.dataToPush[key];
                          return (
                            <StdInput
                              key={index}
                              label={field.displayLabel}
                              type={field.type}
                              enabled={true}
                              fieldLabel={key}
                              value={value}
                              onChange={this.onChange}
                              options={field.options}
                              dateFormat={field.dateFormat}
                              allowEmpty={true}
                              toolTip={field.toolTip}
                            ></StdInput>
                          );
                        })}
                        <StdButton
                          style="primary"
                          onClick={() => {
                            this.next();
                          }}
                        >
                          {finalStep ? "Submit" : "Next"}
                        </StdButton>
                      </div>
                    );
                  })}
                </MultiStepBox>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
