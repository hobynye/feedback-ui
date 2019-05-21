import React, {Component} from 'react';
import Navigation from './Navigation';
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Table from 'react-bootstrap/Table';

const UserRow = ({userList}) => (
    <>
        {userList.map((user, i) => (
            <tr id={"userList" + user.id} key={i}>
                <td>{user.name}</td>
                <td>{user.title}</td>
                <td><a href={"#users/edit/" + user.id}>Edit</a> <a href='#users' onClick={() => {deleteUser(user.id)}}>Delete</a></td>
            </tr>
        ))}
    </>
);

function deleteUser(id) {
    console.log(id);
}


export default class ManageUsers extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: "",
            loading: true,
            userList: []
        }

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
                    console.log(jsonData["users"]);
                    this.setState({loading: false, userList: jsonData["users"]});
                })
                .catch((error) => {
                    // handle your errors here
                    console.error(error)
                });
        })
    };

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
                                            <th>Title</th>
                                            <th>Actions</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        <UserRow userList={this.state.userList}/>
                                        </tbody>
                                    </Table>

                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </div>
        )
    }
}
