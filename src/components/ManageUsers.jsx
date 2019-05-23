import React, {Component} from 'react';
import Gravatar from 'react-gravatar';
import Navigation from './Navigation';
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Table from 'react-bootstrap/Table';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';


export default class ManageUsers extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: "",
            loading: true,
            userList: [],
            show: false,
            showEdit: false,
            modalUser: {}
        };
        this.showDeleteModal = this.showDeleteModal.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.deleteUser = this.deleteUser.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.fetchUsers = this.fetchUsers.bind(this);
        this.toggleAdmin = this.toggleAdmin.bind(this);
        this.showEditModal = this.showEditModal.bind(this);

    }

    componentWillMount() {

        fetch("/api/user/self")
            .then((response) => {
                if (response.status == 405) {
                    window.location.replace("/#/login?next=/#/users");
                }
                return response
            }).then((response) => response.json())
            .then((jsonData) => {
                this.setState({
                    user: jsonData.current_user.name
                });
                this.fetchUsers();
            })
    }

    handleInputChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        let user = this.state.modalUser;
        user[name] = value;
        this.setState({
            modalUser: user
        });
    }

    fetchUsers = () => {
        this.setState({loading: true});
        setTimeout(() => {
            fetch("/api/admin/users")
                .then(response => response.json())
                .then((jsonData) => {
                    this.setState({loading: false, userList: jsonData["users"]});
                })
                .catch((error) => {
                    // handle your errors here
                    console.error(error)
                });
        })
    };

    handleClose() {
        this.setState({
            show: false,
            showEdit: false,
        });
    }

    handleSubmit(event) {
        fetch('/api/admin/user/' + this.state.modalUser.id, {
            method: 'PUT',
            body: JSON.stringify(this.state.modalUser)
        })
            .then(() => this.handleClose())
            .catch((error) => console.log(error));
        event.preventDefault();
    }

    deleteUser() {
        fetch('/api/admin/user/' + this.state.modalUser.id, {
            method: 'DELETE'
        })
            .then(() => {
                    this.setState({
                        show: false
                    });
                    document.getElementById("userList" + this.state.modalUser.id).style.display = "none";
                }
            )
            .catch((error) => {
                console.log(error)
            })
    }

    toggleAdmin(adminBool) {
        fetch('/api/admin/user/' + this.state.modalUser.id, {
            method: 'PUT',
            body: JSON.stringify({
                admin: adminBool
            })
        })
            .then(() => {
                let modUser = this.state.modalUser;
                modUser.admin = adminBool;
                if (!adminBool) {
                    modUser.alert = false;
                }
                this.setState({
                        modalUser: modUser
                    }
                );
            })
            .catch((error) => {
                console.log(error);
            })
    }

    showDeleteModal(user) {
        this.setState({
            modalUser: user,
            show: true
        })
    }

    showEditModal(user) {
        this.setState({
            modalUser: user,
            showEdit: true
        })
    }

    render() {
        return (
            <div>
                <Navigation currentUser={this.state.user}/>
                <Container className={"mt-3"}>
                    <Row>
                        <Col xl>
                            <Card style={{width: '100%'}}>
                                <Card.Body>
                                    <Table striped bordered hover>
                                        <thead>
                                        <tr>
                                            <th>Name</th>
                                            <th className={"d-none d-lg-table-cell"}>Title</th>
                                            <th>Actions</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {this.state.userList.map((user, i) => (
                                            <tr id={"userList" + user.id} key={i}>
                                                <td>
                                                    <div style={{display: "inline-block"}}>
                                                        <Gravatar email={user.email} size={35}
                                                                  style={{
                                                                      borderRadius: "50%",
                                                                      verticalAlign: "sub",
                                                                      marginRight: "10px"
                                                                  }}/>
                                                    </div>
                                                    <div style={{display: "inline-block"}}>
                                                        <strong><p style={{marginBottom: "0px"}}>
                                                            {user.admin &&
                                                            <i className="fas fa-shield-alt"></i>} {user.alert &&
                                                        <i className="fas fa-bell"></i>} {user.name}</p>
                                                        </strong>
                                                        <p style={{display: "block", color: "#6c757d"}}>{user.email}</p>
                                                    </div>
                                                </td>
                                                <td className={"d-none d-lg-table-cell"}>
                                                    <p style={{marginBottom: "0px"}}>{user.title}</p>
                                                    <p style={{
                                                        display: "block",
                                                        color: "#6c757d"
                                                    }}>{user.color} {user.letter}</p>
                                                </td>
                                                <td>
                                                    <p style={{marginBottom: "0px"}}>
                                                        <a href={"#users"} onClick={() => {
                                                            this.showEditModal(user)
                                                        }}>
                                                            <i className="fas fa-edit"></i> Edit
                                                        </a>
                                                    </p>
                                                    <p>
                                                        <a href='#users' onClick={() => {
                                                            this.showDeleteModal(user)
                                                        }} className={"text-danger"}>
                                                            <i className="fas fa-trash-alt"></i> Delete
                                                        </a>
                                                    </p>
                                                </td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </Table>

                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Container>
                <Modal show={this.state.show} onHide={this.handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Delete {this.state.modalUser.name}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        Are you sure you want to delete this user? This action cannot be reversed
                        and all feedback by this user will also be deleted.
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="danger" onClick={() => {
                            this.deleteUser();
                        }}>
                            Delete User
                        </Button>
                    </Modal.Footer>
                </Modal>
                <Modal show={this.state.showEdit} onHide={this.handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Edit {this.state.modalUser.name}</Modal.Title>
                    </Modal.Header>
                    <Form onSubmit={this.handleSubmit}>
                        <Modal.Body>
                            <Form.Group controlId="formEditName">
                                <Form.Label>Name</Form.Label>
                                <Form.Control type="text" defaultValue={this.state.modalUser.name} onChange={this.handleInputChange} name={"name"}/>
                            </Form.Group>
                            <Form.Group controlId="formEditEmail">
                                <Form.Label>Email</Form.Label>
                                <Form.Control type="email" defaultValue={this.state.modalUser.email} onChange={this.handleInputChange} name={"email"}/>
                            </Form.Group>
                            <Form.Group controlId="formEditPhone">
                                <Form.Label>Phone</Form.Label>
                                <Form.Control type="phone" defaultValue={this.state.modalUser.phone} onChange={this.handleInputChange} name={"phone"}/>
                            </Form.Group>
                            <Form.Group controlId="formEditTitle">
                                <Form.Label>Title</Form.Label>
                                <Form.Control type="text" defaultValue={this.state.modalUser.title} onChange={this.handleInputChange} name={"title"}/>
                            </Form.Group>
                            <Form.Group controlId="formEditColor">
                                <Form.Label>Color</Form.Label>
                                <Form.Control as="select" name={"color"} onChange={this.handleInputChange} defaultValue={this.state.modalUser.color}>
                                    <option value={""}>None</option>
                                    <option>Red</option>
                                    <option>Orange</option>
                                    <option>Yellow</option>
                                    <option>Green</option>
                                    <option>Blue</option>
                                    <option>Purple</option>
                                    <option>Silver</option>
                                </Form.Control>
                            </Form.Group>
                            <Form.Group controlId="formEditLetter">
                                <Form.Label>Letter</Form.Label>
                                <Form.Control type="text" defaultValue={this.state.modalUser.letter} onChange={this.handleInputChange} name={"letter"}/>
                            </Form.Group>
                            {(this.state.modalUser.admin && this.state.modalUser.phone)&&
                            <Form.Group>
                                <Form.Check
                                    disabled={!(this.state.modalUser.phone.length === 10)}
                                    type={"checkbox"}
                                    name={"alert"}
                                    label={"Send Text Alerts"}
                                    defaultChecked={this.state.modalUser.alert}
                                    onChange={this.handleInputChange}
                                />
                            </Form.Group>}
                        </Modal.Body>
                        <Modal.Footer>
                            {!this.state.modalUser.admin &&
                            <Button variant="warning" onClick={() => this.toggleAdmin(true)}><i className="fas fa-shield-alt"></i> Make Admin</Button>}
                            {this.state.modalUser.admin &&
                            <Button variant="secondary"><i className="fas fa-key"></i> Change Password</Button>}
                            {this.state.modalUser.admin &&
                            <Button variant="danger" onClick={() => this.toggleAdmin(false)}><i className="fas fa-shield-alt"></i> Remove Admin</Button>

                            }
                            <Button variant="primary" type="submit">
                                Submit
                            </Button>
                        </Modal.Footer>
                    </Form>
                </Modal>
            </div>
        )
    }
}
