import React, {Component} from "react";
import {Button, Form, Header, Modal} from "semantic-ui-react";

export default class RemovePortfolioModal extends Component {
  state = {
    openModal: false,
    portfolioList: this.props.portfolioList,
    portfoliosToRemove: [],
  };

  handleCheckBoxChange = (e, {value}) => {
    const {portfoliosToRemove} = this.state;
    let i = portfoliosToRemove.indexOf(value);
    if (i === -1) {
      this.setState({portfoliosToRemove: [...portfoliosToRemove, value]})
    } else {
      portfoliosToRemove.splice(i, 1)
    }
  };

  handleRemovePortfolio = () => {
    const {portfoliosToRemove} = this.state;
    // remove portfolio here
    this.setState({openModal: false, portfoliosToRemove})
  };
  handleClose = () => this.setState({openModal: false});

  render() {
    const {openModal, portfolioList} = this.state;
    return (<Modal
        open={openModal}
        trigger={<Button negative onClick={() => this.setState({openModal: true})}>Remove Portfolio</Button>}>
        <Modal.Header>Remove portfolio</Modal.Header>
        <Modal.Content>
          <Form>
            {portfolioList && portfolioList.length > 0 ? <Form.Group grouped>
              {portfolioList.map(({name}, i) =>
                <Form.Checkbox key={i} value={name} label={name} onChange={this.handleCheckBoxChange}/>)}
            </Form.Group> : <Header disabled>No portfolios to delete</Header>}
          </Form>
        </Modal.Content>
        <Modal.Actions>
          <Button onClick={this.handleRemovePortfolio} negative>Remove</Button>
          <Button onClick={this.handleClose}>Cancel</Button>
        </Modal.Actions>
      </Modal>
    )
  }
}
  