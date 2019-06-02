import React, {Component} from 'react';
import Container from 'react-bootstrap/Container'
import Card from 'react-bootstrap/Card'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import Navigation from './Navigation'
import Button from 'react-bootstrap/Button'

const FeedbackItem = ({feedback, showHandled, markHandled}) => (
    <>
        {feedback.map(feedback => {
            if (!feedback.handled || showHandled)
                return (
                    <Card bg={feedback.severity} text="white" style={{width: '100%', marginBottom: "15px"}}>
                        <Card.Header style={{display: "inline-flex"}}>
                            <div style={{width: "90%", display: "inline-block"}}>
                            <strong>{feedback.author} {feedback.handled}</strong>
                            <p style={{display: "block"}}>{feedback.role} {feedback.color} {feedback.letter} - {feedback.submitted}</p>
                            </div>
                            <div style={{width: "10%", display: "inline-block"}}>
                            <button type="button" onClick={() => {
                                markHandled(feedback.key, feedback.id);
                            }} className="close" aria-label="Close" style={{paddingTop: "10%"}}>
                                <span aria-hidden="true">&times;</span>
                            </button>
                            </div>
                        </Card.Header>
                        <Card.Body>
                            <Card.Title>{feedback.body}</Card.Title>
                        </Card.Body>
                    </Card>
                );
            return (<></>)
        })}
    </>
);

export default class Results extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: "",
            loading: true,
            feedback: [],
            showHandled: false
        };
        this.toggleShowHandled = this.toggleShowHandled.bind(this);
        this.markHandled = this.markHandled.bind(this);
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
                this.fetchFeedback();
            })
    }

    componentDidMount() {
        this.interval = setInterval(() => {
            this.fetchFeedback()
        }, 30000);
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    markHandled(key, fid) {
        fetch('/api/feedback/' + fid, {
            method: 'PUT'
        })
            .then(() => {
                this.fetchFeedback();
            })
            .catch((error) => console.log(error));

    }

    toggleShowHandled() {
        this.setState({
            showHandled: !this.state.showHandled
        })
    }

    fetchFeedback = () => {
        this.setState({loading: true});
        let feedbackArray = [];
        let sevMapping = {
            Red: "danger",
            Yellow: "warning",
            Green: "success"
        };
        setTimeout(() => {
            fetch("/api/feedback")
                .then(response => response.json())
                .then((jsonData) => {
                    const feedback = jsonData["results"];
                    const arrayLength = feedback.length;
                    for (let i = 0; i < arrayLength; i++) {
                        let timestamp = new Date(0);
                        timestamp.setUTCSeconds(feedback[i]["submitted"]);
                        feedbackArray.push(
                            {
                                key: i,
                                id: feedback[i]["id"],
                                author: feedback[i]["author"],
                                handled: feedback[i]["handled"],
                                role: feedback[i]["role"],
                                color: feedback[i]["color"],
                                letter: feedback[i]["letter"],
                                severity: sevMapping[feedback[i]["severity"]],
                                body: feedback[i]["body"],
                                submitted: timestamp.toString()
                            }
                        )
                    }
                })
                .then(() => {
                    this.setState({loading: false, feedback: feedbackArray});
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
                        <Col xl className={"mb-2 float-right"}>
                            {this.state.showHandled &&
                            <Button className={"float-right ml-2 mb-2"} onClick={() => this.toggleShowHandled()}>
                                <i className="fas fa-eye-slash"></i> Hide Handled Feedback
                            </Button>}
                            {!this.state.showHandled &&
                            <Button className={"float-right ml-2 mb-2"} onClick={() => this.toggleShowHandled()}>
                                <i className="fas fa-eye"></i> Show Handled Feedback
                            </Button>}
                            <a className={"btn btn-success float-right"} href={"/api/feedback?download=true"}>
                                <i className="fas fa-cloud-download-alt"></i> Download
                            </a>
                        </Col>
                    </Row>
                    <Row>
                        <Col xl>
                            <FeedbackItem feedback={this.state.feedback} showHandled={this.state.showHandled} markHandled={this.markHandled}/>
                        </Col>
                    </Row>
                </Container>
            </div>
        )
    }
}
