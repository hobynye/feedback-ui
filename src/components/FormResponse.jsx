import React, {Component} from 'react';
import Form from 'react-bootstrap/Form'

export default class FormResponse extends Component {
    render() {
        return (
            <Form.Group controlId="formFeedbackResponse">
                <Form.Label>Do you need to hear back?</Form.Label>
                <Form.Control as="select" name="response" onChange={this.props.handleInputChange}>
                    <option value="ASAP">Yes, ASAP please!</option>
                    <option value="Yes">Yes, when you get a chance.</option>
                    <option value="No" selected>No, just wanted to let you know.</option>
                </Form.Control>
            </Form.Group>
        )
    }
}