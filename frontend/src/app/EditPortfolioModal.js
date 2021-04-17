import React, {Component} from "react";
import {Button, Form, Header, Modal} from "semantic-ui-react";

export default class EditPortfolioModal extends Component {
  state = {
    openModal: this.props.open,
    portfolio: this.props.selected
  };


  render() {
    const {openModal, portfolio} = this.state;
    return (<Modal
        open={openModal}>
        <Header as={'h1'}>Edit "{portfolio['name']}"</Header>
        <Modal.Content>
          <Form onSubmit={this.handleSubmit}>
            <Form.Input label={'Name'} placeholder={"max. 10 characters"}/>
            <Form.Input label={'Description'}/>
          </Form>
        </Modal.Content>
        <Modal.Actions>
          <Button onClick={this.handleSubmit} positive>Save</Button>
          <Button onClick={this.props.onClose}>Cancel</Button>
        </Modal.Actions>
      </Modal>
    )
  }
}