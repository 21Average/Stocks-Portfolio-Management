import React, {Component} from "react";
import {Button, Form, Modal, Message} from "semantic-ui-react";
import axios from "axios";
import {AXIOS_HEADER, BACKEND_URL} from "../defaults";

export default class AddPortfolioModal extends Component {
  state = {
    name: '',
    ptype: '',
    desc: '',
    openModal: false,
    showError: false,
    errorMsg: ''
  };

  handleChange = (e, {name, value}) => {
    this.setState({[name]: value, showError: false});
  };
  handlePortTypeChange = (e, {value}) => {
    this.setState({ptype: value});
  };
  handleClose = () => this.setState({openModal: false});

  handleSubmitPortfolio = () => {
    const {name, ptype, desc} = this.state;
    const token = localStorage.getItem("token");
    if (name && ptype && desc) {
      if (name.length > 10) {
        this.setState({showError: true, errorMsg: 'Portfolio name can only be max. 10 characters'});
      } else {
        if (token) {
          axios({
            headers: AXIOS_HEADER(token),
            method: 'post', url: `${BACKEND_URL}/stocks/createNewPortfolio/`,
            data: {'ptype': ptype, 'name': name, 'desc': desc}
          }).then(({data}) => {
            localStorage.setItem("p_id", data['id']);
            localStorage.setItem("p_name", data['name']);
            localStorage.setItem("p_type", data['ptype']);
            window.location.reload()
          }).catch(({response}) => {
            alert(response.data['error'])
          })
        }
      }
    } else {
      this.setState({showError: true, errorMsg: 'Please fill in all the fields.'})
    }
  };

  render() {
    const {openModal, ptype, showError, errorMsg} = this.state;
    const portfolioTypes = [{name: 'Watchlist'}, {name: 'Transaction'}];

    return (<Modal size={'small'}
                   open={openModal}
                   trigger={<Button positive onClick={() => this.setState({openModal: true})}>Create
                     Portfolio</Button>}>
      <Modal.Header>Add new portfolio</Modal.Header>
      <Modal.Content>
        <Form>
          <Form.Input label={'Portfolio name'} placeholder={'max. 10 characters'} name={'name'}
                      onChange={this.handleChange}/>
          <Form.Input label={'Portfolio description'} name={'desc'} onChange={this.handleChange}/>
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
          {showError && <Message negative>{errorMsg}</Message>}
        </Form>
      </Modal.Content>
      <Modal.Actions>
        <Button onClick={this.handleSubmitPortfolio} positive>Add</Button>
        <Button onClick={this.handleClose}>Cancel</Button>
      </Modal.Actions>
    </Modal>)
  }
}