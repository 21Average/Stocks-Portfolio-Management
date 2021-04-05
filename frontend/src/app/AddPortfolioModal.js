import React, {Component} from "react";
import {Button, Form, Modal} from "semantic-ui-react";
import axios from "axios";
import {AXIOS_HEADER, BACKEND_URL} from "../defaults";

export default class AddPortfolioModal extends Component {
  state = {
    name: '',
    ptype: '',
    desc: '',
    openModal: false
  };

  handleChange = (e, {name, value}) => {
    this.setState({[name]: value});
  };
  handlePortTypeChange = (e, {value}) => {
    this.setState({ptype: value});
  };
  handleClose = () => this.setState({openModal: false});

  handleSubmitPortfolio = () => {
    const {name, ptype, desc} = this.state;
    const token = localStorage.getItem("token");
    if (token) {
      axios({
        headers: AXIOS_HEADER(token),
        method: 'post', url: `${BACKEND_URL}/stocks/createPortfolio/`,
        data: {'ptype': ptype, 'name': name, 'desc': desc}
      }).then(({data}) => {
        // this.handleClose();
        localStorage.setItem("p_id", data['id']);
        localStorage.setItem("p_name", data['name']);
        window.location.reload()
      }).catch(({error}) => {
        alert(error)
      })
    }
  };

  render() {
    const {openModal, ptype} = this.state;
    const portfolioTypes = [{name: 'Watchlist'}, {name: 'Transaction'}];

    return (<Modal
      open={openModal}
      trigger={<Button positive onClick={() => this.setState({openModal: true})}>Create Portfolio</Button>}>
      <Modal.Header>Add new portfolio</Modal.Header>
      <Modal.Content>
        <Form>
          <Form.Input label={'Portfolio Name'} name={'name'} onChange={this.handleChange}/>
          <Form.Input label={'Portfolio Description'} name={'desc'} onChange={this.handleChange}/>
          <Form.Group inline>
            <label>Type</label>
            {portfolioTypes.map(({name}, i) =>
              <Form.Radio
                key={i}
                label={name}
                value={name}
                checked={ptype === name}
                onChange={this.handlePortTypeChange}/>
            )}
          </Form.Group>
        </Form>
      </Modal.Content>
      <Modal.Actions>
        <Button onClick={this.handleSubmitPortfolio} positive>Add</Button>
        <Button onClick={this.handleClose}>Cancel</Button>
      </Modal.Actions>
    </Modal>)
  }
}