import React, { Component } from "react";
import LoadingOverlay from "react-loading-overlay";
import { Button } from "reactstrap";
import Axios from "axios";
import axios from "axios";
export default class resetpassword extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      password: "",
      emailError: "",
      loading: false,
      loginBody: "You can reset your password now!",
      showSignIn: true,
      everythingOk: false,
    };
  }

  changeHandler = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };
  componentDidMount() {
    console.log("componentdidmount");
    let encryptemail = this.props.match.params.slug;
    console.log(encryptemail);
    this.setState({
      email: encryptemail,
    });
  }
  backClick = () => {
    console.log(this.state.email);
    this.props.history.push("/");
  };
  showEmail = () => {
    console.log(this.state.email);
  };
  resetPassword = async () => {
    const { email, password } = this.state;
    const resetPassword = {
      email,
      password,
    };

    const response = await axios.put(
      "https://localhost:44332/Users/ForgotPassword/",
      resetPassword
    );
    console.log(response);
  };
  render() {
    const { password } = this.state;
    return (
      <LoadingOverlay
        active={this.state.loading}
        spinner
        text="Processing..."
        styles={{
          overlay: (base) => ({
            ...base,
            background: "rgba(40, 116, 166, 0.4)",
          }),
        }}
      >
        <div className="cont">
          <div className="form sign-in">
            <h2>Reset your password</h2>
            <label>
              <span>Password</span>
              <input
                type="password"
                name="password"
                placeholder="Type your e-mail here..."
                value={password}
                onChange={this.changeHandler}
              />
            </label>
            <div style={{ fontSize: 12, color: "red" }}>
              {this.state.emailError}
            </div>
            {/* <label>
              <span>Confirm password</span>
              <input
                type="text"
                name="confirmpassword"
                placeholder="Type your e-mail here..."
                onChange={this.changeHandler}
              />
            </label> */}

            <br></br>
            <br></br>
            <Button
              className="btn-circle submit"
              type="button"
              onClick={this.resetPassword}
            >
              RESET PASSWORD
            </Button>
            <br></br>
          </div>

          <div className="sub-cont">
            <div className="img">
              <div className="img-text m-up">
                <p>{this.state.loginBody}</p>
              </div>
              <div className="img-text m-in">
                <div></div>
              </div>
            </div>
          </div>
        </div>
      </LoadingOverlay>
    );
  }
}
