import React, { Component } from "react";
import LoadingOverlay from "react-loading-overlay";
import { Button } from "reactstrap";
import Axios from "axios";
import axios from "axios";

export default class forgotpassword extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      emailError: "",

      loading: false,
      loginHead: "Don't worry!",
      loginBody: "We can send you a reset password e-mail.",
      showSignIn: true,
      everythingOk: false,
    };
  }

  changeHandler = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };
  backClick = () => {
    this.props.history.push("/");
  };
  sendResetEmail = async () => {
    const { email } = this.state;
    const response = await axios.get(
      "https://localhost:44332/Users/EncryptEmail/" + email
    );
    console.log(response);
    localStorage.setItem("encryptedemail", response);
  };
  render() {
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
            <h2>Forgot Your Passowrd?</h2>
            <label>
              <span>E-Mail</span>
              <input
                type="text"
                name="email"
                placeholder="Type your e-mail here..."
                onChange={this.changeHandler}
              />
            </label>
            <div style={{ fontSize: 12, color: "red" }}>
              {this.state.emailError}
            </div>

            <br></br>
            <br></br>
            <Button
              className="btn-circle submit"
              type="button"
              onClick={this.sendResetEmail}
            >
              Send Reset email
            </Button>
            <br></br>
            <Button
              className="btn-circle submit"
              type="button"
              onClick={this.backClick}
            >
              Go back
            </Button>
          </div>

          <div className="sub-cont">
            <div className="img">
              <div className="img-text m-up">
                <h2>{this.state.loginHead}</h2>
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
