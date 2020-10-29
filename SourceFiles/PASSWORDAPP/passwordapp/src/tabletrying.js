import React from "react";
import "bootstrap/dist/css/bootstrap.css";
import { Button, Modal, Accordion, ModalBody, Row, Col } from "react-bootstrap";
import SplitText from "react-pose-text";
import MaterialTable from "material-table";
import axios from "axios";
import LoadingOverlay from "react-loading-overlay";
import { Navbar, Nav, NavDropdown } from "react-bootstrap";

import copy from "copy-to-clipboard";
import alertify from "alertifyjs";
import { propTypes } from "react-bootstrap/esm/Image";
import { lightGreen } from "@material-ui/core/colors";
const charPoses = {
  exit: { opacity: 0, y: 20 },
  enter: {
    opacity: 1,
    y: 0,
    delay: ({ charIndex }) => charIndex * 30,
  },
};

export default class tabletrying extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      columns: [
        { title: "Platform Name", field: "name" },
        { title: "Description", field: "description" },
        {
          title: "Details",
          render: (rowData) => (
            <Button
              type="button"
              className="btn-circle btn-sm btn-info"
              data-toggle="modal"
              data-target="#exampleModalCenter"
              onClick={this.getDetails.bind(
                this,
                rowData.username,
                rowData.password,
                rowData.id,
                rowData.name,
                rowData.description
              )}
            >
              Show Details
            </Button>
          ),
        },
        // { title: "Username", field: "username" },
        // { title: "Passwords", field: "passwords" },

        // {
        //   title: "Show Password",
        //   render: (rowData) => (
        //     <Button
        //       onClick={this.showPassword.bind(
        //         this,
        //         rowData.tableData.id,
        //         rowData.password
        //       )}
        //       className="btn-circle btn-sm btn-info"
        //     >
        //       S
        //     </Button>
        //   ),
        // },
        // {
        //   title: "Copy Password",
        //   render: (rowData) => (
        //     <Button
        //       onClick={this.copyToClipboard.bind(this, rowData.password)}
        //       className="btn-circle btn-sm btn-info"
        //     >
        //       C
        //     </Button>
        //   ),
        // },
      ],
      data: [
        {
          id: "",
          name: "",
          description: "",
          password: "",
          passwords: "",
          usernames: "",
        },
      ],
      title: localStorage.getItem("willSendName") + "'s password list",
      loading: false,
      userId: localStorage.getItem("willSendId"),
      hide: false,
      show: false,
      password: "",
      confirmPassword: "",
      passwordError: "",
      isEverythingOk: false,
      detailPlatformName: "",
      detailDescription: "",
      detailUsername: "",
      detailPassword: "",
      detailId: "DEGİSMEDİ",
      willShowPassword: "●●●●●●",
      willShowUsername: "●●●●●●",
      editModal: false,
      showDetailModal: false,
      showEditItemModal: false,
      showDeleteItemModal: false,
    };
  }
  handleShowDetailModal = () => {
    this.setState({ showDetailModal: !this.state.showDetailModal });
  };
  handleEditItemModal = () => {
    this.setState({ showDetailModal: !this.state.showDetailModal });
    this.setState({ showEditItemModal: !this.state.showEditItemModal });
  };
  handleDeleteItemModal = () => {
    this.setState({ showDetailModal: !this.state.showDetailModal });
    this.setState({ showDeleteItemModal: !this.state.showDeleteItemModal });
  };
  handleEditModal = () => {
    this.setState({ editModal: !this.state.editModal });
  };
  getDetails = (username, password, itemid, name, description, e) => {
    this.setState({ showDetailModal: !this.state.showDetailModal });
    e.preventDefault();
    this.setState({ willShowPassword: "●●●●●●" });
    this.setState({ willShowUsername: "●●●●●●" });
    // this.setState({ detailId: itemid });
    this.state.detailId = itemid;
    this.setState({ detailPlatformName: name });
    this.setState({ detailDescription: description });
    this.setState({ detailUsername: username });
    console.log(itemid);
    this.setState({ detailPassword: password });
    console.log(this.state.detailPlatformName);
    console.log(this.state.detailDescription);
    console.log(this.state.detailUsername);
    console.log(this.state.detailPassword);
    console.log(this.state.detailId);
    this.forceUpdate();
    this.handleShowDetailModal();
  };

  handleModal() {
    this.setState({ name: "" });
    this.setState({ description: "" });
    this.setState({ password: "" });
    this.setState({ passwordError: "" });
    this.setState({ show: !this.state.show });
  }
  componentDidMount = async () => {
    console.log("componentDidMount");
    this.setState({ loading: true });
    var arr = [];
    this.setState({ userId: localStorage.getItem("willSendId") });
    const { userId } = this.state;
    const response = await axios.get(
      "https://localhost:44332/PasswalletItems/GetItem/" + userId
    );
    console.log(response);

    for (let index = response.data.length - 1; index >= 0; index--) {
      let obj = {};
      obj.id = response.data[index].id;
      obj.name = response.data[index].name;
      obj.description = response.data[index].description;
      obj.username = response.data[index].username;
      obj.password = response.data[index].password;
      obj.passwords = "●●●●●●";
      arr.push(obj);
    }
    this.setState({ data: arr });
    this.setState({ loading: false });
  };

  getItemsAgain = async () => {
    console.log("getItemsAgain");
    this.setState({ loading: true });
    var arr = [];
    this.setState({ userId: localStorage.getItem("willSendId") });
    const { userId } = this.state;
    const response = await axios.get(
      "https://localhost:44332/PasswalletItems/GetItem/" + userId
    );
    console.log(response);

    for (let index = response.data.length - 1; index >= 0; index--) {
      let obj = {};
      obj.id = response.data[index].id;
      obj.name = response.data[index].name;
      obj.description = response.data[index].description;
      obj.username = response.data[index].username;
      obj.password = response.data[index].password;
      obj.passwords = "●●●●●●";
      arr.push(obj);
    }
    this.setState({ data: arr });
    this.setState({ loading: false });
  };
  deleteItem = async () => {
    this.setState({ showDeleteItemModal: !this.state.showDeleteItemModal });
    const response = await axios.delete(
      "https://localhost:44332/PasswalletItems/DeleteItem/" +
        this.state.detailId
    );
    this.getItemsAgain();
    console.log(response);
  };
  copyToClipboard = (password, e) => {
    copy(password);
    console.log(password);
    alertify.set("notifier", "position", "right-bottom");
    alertify.success("✓ Copied to clipboard!");
  };
  goToTheHomePage = () => {
    localStorage.removeItem("willSendId");
    localStorage.removeItem("willSendName");
    localStorage.clear();
    debugger;
    this.props.history.push("/");
  };
  showPassword2 = () => {
    if (this.state.willShowPassword === "●●●●●●") {
      this.setState({
        willShowPassword: this.state.detailPassword,
      });
      console.log(this.state.detailPassword);
    } else {
      this.setState({ willShowPassword: "●●●●●●" });
    }
  };
  ShowUsername = () => {
    if (this.state.willShowUsername === "●●●●●●") {
      this.setState({
        willShowUsername: this.state.detailUsername,
      });
      console.log(this.state.detailUsername);
    } else {
      this.setState({ willShowUsername: "●●●●●●" });
    }
  };
  copyToClipboardUsername = () => {
    copy(this.state.detailUsername);
    alertify.set("notifier", "position", "right-bottom");
    alertify.success("✓ Username copied to clipboard!");
  };
  copyToClipBoardPassword = () => {
    copy(this.state.detailPassword);
    alertify.set("notifier", "position", "right-bottom");
    alertify.success("✓ Password copied to clipboard!");
  };
  showPassword = (id, password, e) => {
    console.log(this.state.hide);
    if (this.state.data[id].passwords === "●●●●●●") {
      let data = [...this.state.data];
      // 2. Make a shallow copy of the item you want to mutate
      let item = { ...data[id] };
      // 3. Replace the property you're intested in
      item.passwords = password;
      // 4. Put it back into our array. N.B. we are mutating the array here, but that's why we made a copy first
      data[id] = item;
      // 5. Set the state to our new copy
      this.setState({ data });
    } else {
      let data = [...this.state.data];
      // 2. Make a shallow copy of the item you want to mutate
      let item = { ...data[id] };
      // 3. Replace the property you're intested in
      item.passwords = "●●●●●●";
      // 4. Put it back into our array. N.B. we are mutating the array here, but that's why we made a copy first
      data[id] = item;
      this.setState({ data });
    }
    this.setState({ hide: !this.state.hide });
  };
  validate = () => {
    let passwordError = "";

    if (this.state.password !== this.state.confirmPassword) {
      passwordError = "Passwords does not match. Please try again.";
    }
    if (passwordError) {
      this.setState({ passwordError });
    } else {
      this.setState({ passwordError: "" });
    }
    if (passwordError === "") {
      this.setState({ isEverythingOk: true });
    }

    console.log(passwordError);
  };
  putItem = async (e) => {
    this.setState({ showEditItemModal: !this.state.showEditItemModal });
    console.log("putitem");
    this.setState({ loading: true });
    e.preventDefault();
    const {
      detailId,
      userId,
      detailPlatformName,
      detailDescription,
      detailUsername,
      detailPassword,
    } = this.state;
    let id = detailId;
    let userid = userId;
    let name = detailPlatformName;
    let description = detailDescription;
    let username = detailUsername;
    let password = detailPassword;
    const newUser = {
      id,
      userid,
      name,
      description,
      username,
      password,
    };
    const response = await axios.put(
      "https://localhost:44332/PasswalletItems/UpdateWallet/" +
        this.state.detailId,
      newUser
    );
    this.getItemsAgain();
    this.handleEditModal();
    this.handleShowDetailModal();
  };
  submitHandler = async (e) => {
    let isValid = this.validate();
    this.setState({ loading: true });
    e.preventDefault();
    this.setState({ userId: localStorage.getItem("willSendId") });
    const { userId, name, description, username, password } = this.state;
    const newUser = {
      userId,
      name,
      description,
      username,
      password,
    };
    if (this.state.isEverythingOk === false) {
      alertify.set("notifier", "position", "bottom-center");
      alertify.error("First fix errors!");
    } else if (
      this.state.password === "" &&
      this.state.confirmPassword === ""
    ) {
      this.setState({ passwordError: "Password fields can not be empty!" });
    } else {
      this.handleModal();
      try {
        const response = await axios.post(
          "https://localhost:44332/PasswalletItems/AddItem/",
          newUser
        );
        e.preventDefault();
        alertify.set("notifier", "position", "top-center");
        alertify.notify("Password Added Successfully!", "custom");
        this.getItemsAgain();
        this.setState({ passwordError: "" });
      } catch (error) {
        alert("Error");
      }
    }
    this.setState({ loading: false });
  };
  changeHandler = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  render() {
    let u_name = localStorage.getItem("willSendName");
    const {
      name,
      description,
      username,
      password,
      confirmPassword,
      detailPlatformName,
      detailDescription,
      detailUsername,
      detailPassword,
    } = this.state;
    return (
      <div>
        <Navbar
          collapseOnSelect
          expand="lg"
          bg="dark"
          variant="dark"
          fixed="top"
        >
          <Navbar.Brand href="#home">PassWallet</Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <div className="setNavButtons">
              <Nav className="mr-auto">
                <Button
                  href="#modal"
                  className="btn-success btn-cric"
                  onClick={() => this.handleModal()}
                >
                  Add Password
                </Button>
                <Button
                  eventKey={2}
                  href="#logout"
                  className="totheright btn-danger"
                  onClick={this.goToTheHomePage}
                >
                  Log Out
                </Button>
              </Nav>
            </div>
          </Navbar.Collapse>
        </Navbar>
        <h1 color="#ff0000">Welcome, {localStorage.getItem("willSendName")}</h1>
        <div className="container"></div>
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
          <Modal show={this.state.show}>
            <Modal.Header>
              <Button
                className="myNewButton btn-danger"
                onClick={() => this.handleModal()}
              >
                X
              </Button>
            </Modal.Header>

            <Modal.Body>
              <form className="denemelersuruyor">
                <label>
                  <span>Platform Name</span>
                  <input
                    type="text"
                    name="name"
                    placeholder="Type your platforname here..."
                    className="inpdeneme"
                    value={name}
                    onChange={this.changeHandler}
                  />
                </label>
                <label>
                  <span>Description</span>
                  <input
                    type="text"
                    name="description"
                    placeholder="Type description here..."
                    className="inpdeneme"
                    value={description}
                    onChange={this.changeHandler}
                  />
                </label>
                <label>
                  <span>Username</span>
                  <input
                    type="text"
                    name="username"
                    className="inpdeneme"
                    placeholder="Type username here..."
                    value={username}
                    onChange={this.changeHandler}
                  ></input>
                </label>
                <label>
                  <span>Password</span>
                  <input
                    type="password"
                    name="password"
                    className="inpdeneme"
                    placeholder="Type your password here..."
                    value={password}
                    onChange={this.changeHandler}
                    onBlur={() => this.validate()}
                  />
                </label>
                <div style={{ fontSize: 12, color: "red" }}>
                  {this.state.passwordError}
                </div>
                <label>
                  <span>Confirm Password</span>
                  <input
                    type="password"
                    name="confirmPassword"
                    className="inpdeneme"
                    value={confirmPassword}
                    onChange={this.changeHandler}
                    onBlur={() => this.validate()}
                  />
                </label>
                <div style={{ fontSize: 12, color: "red" }}>
                  {this.state.passwordError}
                </div>
              </form>

              <div className="bttn-submit-position">
                <Button
                  className="submitButton btn-dark"
                  onClick={this.submitHandler}
                >
                  Submit
                </Button>
              </div>
            </Modal.Body>
          </Modal>
          <Modal show={this.state.showDetailModal} size="lg" centered="true">
            <Modal.Header>
              Details{" "}
              <Button
                className="myNewButton btn-danger"
                onClick={() => this.handleShowDetailModal()}
              >
                X
              </Button>
            </Modal.Header>
            <Modal.Body>
              <Row>
                <Col>
                  <h5>Username: {this.state.willShowUsername}</h5>
                </Col>
                <Col>
                  <h5>Password: {this.state.willShowPassword}</h5>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Button
                    type="button"
                    onClick={this.ShowUsername}
                    className="btn-info btn-circle show"
                  >
                    Show UserName
                  </Button>
                  <br></br>
                  <Button
                    type="button"
                    onClick={this.copyToClipboardUsername}
                    className="btn-success btn-circle copy"
                  >
                    Copy UserName
                  </Button>
                </Col>

                <Col>
                  <Button
                    type="button"
                    onClick={this.showPassword2}
                    className="btn-info btn-circle show"
                  >
                    Show Password
                  </Button>

                  <Button
                    type="button"
                    onClick={this.copyToClipBoardPassword}
                    className="btn-success btn-circle copy"
                  >
                    Coppy Password
                  </Button>
                </Col>
              </Row>
            </Modal.Body>
            <Modal.Footer>
              <Button
                type="button"
                className="btn-dark btn-circle edititem"
                onClick={this.handleEditItemModal}
              >
                Edit Item
              </Button>
              <Button
                type="button"
                onClick={this.handleDeleteItemModal}
                className="btn-danger btn-circle delete"
              >
                Delete Item
              </Button>
            </Modal.Footer>
          </Modal>
          {/* <div
            class="modal fade"
            id="exampleModalCenter"
            tabindex="-1"
            role="dialog"
            aria-labelledby="exampleModalCenterTitle"
          >
            <div
              class="modal-dialog modal-dialog-centered modal-lg"
              role="document"
            >
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title" id="exampleModalLongTitle">
                    Details of {this.state.detailPlatformName}
                  </h5>
                  <button
                    aria-label="Close"
                    className="clsBttn"
                    data-dismiss="modal"
                  >
                    X
                  </button>
                </div>
                <div class="modal-body">
                  {" "}
                  
                </div>
                <div class="modal-footer">
                 {" "}
                </div>
              </div>
            </div>
          </div> */}
          {/* <Modal.Header className="modalheadercss">
              <Button
                className="myNewButton btn-danger"
                onClick={this.handleShowDetailModal}
              >
                X
              </Button>
            </Modal.Header>
            <Modal.Body className="modalbodycss">
              UserName:{this.state.willShowUsername}
              Password:{this.state.willShowPassword}
              <Row>
                <Col>
              <Button type="button" onClick={this.showPassword2}>
                ShowPassowrd
              </Button>
              <Button type="button" onClick={this.ShowUsername}>
                ShowUserName
              </Button>
              </Col>
              
              
                <Col>
              <Button type="button" onClick={this.copyToClipBoardPassword}>
                CoppyPassword
              </Button>
              <Button type="button" onClick={this.copyToClipboardUsername}>
                CopyUserName
              </Button>
              </Col>
              </Row>
              <Button
                type="button"
                onClick={this.deleteItem}
                data-toggle="modal"
                data-target="#exampleModalCenter"
              >
                DeleteItem
              </Button>{" "}
            </Modal.Body>
            <Modal.Footer>
              <Button onClick={this.handleEditModal}>Edit</Button>
            </Modal.Footer> */}
          <Modal show={this.state.showEditItemModal} centered="true">
            <Modal.Header>
              Edit{" "}
              <Button
                className="myNewButton btn-danger"
                onClick={() => this.handleEditItemModal()}
              >
                X
              </Button>
            </Modal.Header>
            <Modal.Body>
              <form className="denemelersuruyor">
                <label>
                  <span>Platform Name</span>
                  <input
                    type="text"
                    name="detailPlatformName"
                    placeholder="Type your platforname here..."
                    className="inpdeneme"
                    value={detailPlatformName}
                    onChange={this.changeHandler}
                  />
                </label>
                <label>
                  <span>Description</span>
                  <input
                    type="text"
                    name="detailDescription"
                    placeholder="Type description here..."
                    className="inpdeneme"
                    value={detailDescription}
                    onChange={this.changeHandler}
                  />
                </label>
                <label>
                  <span>Username</span>
                  <input
                    type="text"
                    name="detailUsername"
                    className="inpdeneme"
                    placeholder="Type username here..."
                    value={detailUsername}
                    onChange={this.changeHandler}
                  ></input>
                </label>
                <label>
                  <span>Password</span>
                  <input
                    type="password"
                    name="detailPassword"
                    className="inpdeneme"
                    placeholder="Type your password here..."
                    value={detailPassword}
                    onChange={this.changeHandler}
                  />
                </label>
                <div style={{ fontSize: 12, color: "red" }}>
                  {this.state.passwordError}
                </div>
                <label>
                  <span>Confirm Password</span>
                  <input
                    type="password"
                    name="detailPassword"
                    className="inpdeneme"
                    value={detailPassword}
                    onChange={this.changeHandler}
                  />
                </label>
                <div style={{ fontSize: 12, color: "red" }}>
                  {this.state.passwordError}
                </div>
              </form>
            </Modal.Body>
            <Modal.Footer>
              <Button
                type="submit"
                className="btn-dark btn-circle edititem"
                onClick={this.putItem}
                data-dismiss="modal"
              >
                Save changes
              </Button>
            </Modal.Footer>
          </Modal>
          {/* <div
            class="modal fade"
            id="exampleModalCenter2"
            tabindex="-1"
            role="dialog"
            aria-labelledby="exampleModalCenterTitle"
            aria-hidden="true"
          >
            <div class="modal-dialog modal-dialog-centered" role="document">
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title" id="exampleModalLongTitle">
                    Edit infos of {this.state.detailPlatformName}
                  </h5>
                  <button
                    aria-label="Close"
                    className="clsBttn"
                    data-dismiss="modal"
                  >
                    X
                  </button>
                </div>
                <div class="modal-body">
                  
                </div>
                <div class="modal-footer">
                  
                </div>
              </div>
            </div>
          </div> */}
          {/* AREYOU SURE YOU WANT TO DELETE MODAL */}
          <Modal
            show={this.state.showDeleteItemModal}
            size="lg"
            centered="true"
          >
            <Modal.Header></Modal.Header>
            <Modal.Body>
              <div style={{ fontSize: 12, color: "red"}}>
                <b><h3 >Are you sure you want to delete this item?</h3></b>
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Row>
                <Col>
                  <Button
                    type="button"
                    className="btn-danger btn-circle delete"
                    onClick={this.deleteItem}
                  >
                    YES
                  </Button>
                </Col>
                <Col>
                  <Button
                    type="button"
                    className="btn-success btn-circle copy"
                    onClick={this.handleDeleteItemModal}
                  >
                    NO
                  </Button>
                </Col>
              </Row>
            </Modal.Footer>
          </Modal>
          {/* <div
            class="modal fade"
            id="askdeletemodal"
            tabindex="-1"
            role="dialog"
            aria-labelledby="exampleModalCenterTitle"
            aria-hidden="true"
          >
            <div
              class="modal-dialog modal-dialog-centered modal-lg"
              role="document"
            >
              <div class="modal-content">
                <div class="modal-body">
                  <div style={{ fontSize: 12, color: "red" }}>
                    <h3>Are you sure you want to delete this item?</h3>
                  </div>
                </div>
                <div class="modal-footer">
                  <Row>
                    <Col>
                      <Button
                        type="button"
                        className="btn-danger btn-circle delete"
                        data-dismiss="modal"
                        onClick={this.deleteItem}
                      >
                        YES
                      </Button>
                    </Col>
                    <Col>
                      <Button
                        type="button"
                        className="btn-success btn-circle copy"
                        data-dismiss="modal"
                      >
                        NO
                      </Button>
                    </Col>
                  </Row>
                  <script></script>
                </div>
              </div>
            </div>
          </div> */}
          {/* AREYOU SURE YOU WANT TO DELETE MODAL */}
          <MaterialTable
            title={this.state.title}
            columns={this.state.columns}
            data={this.state.data}
          />
        </LoadingOverlay>
      </div>
    );
  }
}
