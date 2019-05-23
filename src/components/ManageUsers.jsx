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


export default class ManageUsers extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: "",
            loading: true,
            userList: [],
            show: false,
            modalUser: {}
        };
        this.showDeleteModal = this.showDeleteModal.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.deleteUser = this.deleteUser.bind(this);
    }

    componentWillMount() {

        fetch("/api/user/self")
            .then((response) => {
                if (response.status == 405) {
                    window.location.replace("/#/login?next=/#/results");
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
        this.setState({show: false});
    }

    deleteUser(id) {
        fetch('/api/admin/user/' + id, {
            method: 'DELETE'
        })
            .then(() => {
                    this.setState({
                        show: false
                    });
                    document.getElementById("userList" + id).style.display = "none";
                }
            )
            .catch((error) => {
                console.log(error)
            })
    }

    showDeleteModal(user) {
        this.setState({
            modalUser: user,
            show: true
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
                                                        <strong><p style={{marginBottom: "0px"}}>{user.name}</p>
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
                                                        <a href={"#users/edit/" + user.id}>
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
                    <Modal.Body>Are you sure you want to delete this user?</Modal.Body>
                    <Modal.Footer>
                        <Button variant="danger" onClick={() => {
                            this.deleteUser(this.state.modalUser.id)
                        }}>
                            Delete User
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        )
    }
}
