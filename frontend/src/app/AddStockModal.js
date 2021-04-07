import React, {Component} from "react";
import {Button, Form, Modal} from "semantic-ui-react";
import axios from "axios";
import {AXIOS_HEADER, BACKEND_URL} from "../defaults";

export default class AddStockModal extends Component {
  state = {
    name: '',
    price: '',
    quantity: '',
    openModal: false
  };

  handleChange = (e, {name, value}) => {
    this.setState({[name]: value});
  };

  handleClose = () => this.setState({openModal: false});

  handleAdd = () => {
    const {name, price, quantity} = this.state;
    const token = localStorage.getItem("token");
    if (token) {
      axios({
        headers: AXIOS_HEADER(token),
        method: 'post', url: `${BACKEND_URL}/stocks/${this.props.pID}/addStock/`,
        data: {'ticker': name, 'buying_price': price, 'quality': quantity}
      }).then(() => {
        // this.handleClose();
        localStorage.setItem("p_id", this.props.pID);
        localStorage.setItem("p_name", this.props.pName);
        localStorage.setItem("p_type", this.props.pType);
        window.location.reload();
      }).catch(() => {
        alert("Oops! Something went error. Please try again later")
      })
    }
  };

  render() {
    const {openModal} = this.state;

    return (<Modal
      open={openModal}
      trigger={<Button positive onClick={() => this.setState({openModal: true})}>Add Stock</Button>}>
      <Modal.Header>Add new stock</Modal.Header>
      <Modal.Content>
        {this.props.pType === 'Transaction' ? <Form>
          <Form.Input label={'Stock Name'} name={'name'} onChange={this.handleChange}/>
          <Form.Input label={'Buying price'} placeholder={'round to 2 decimal places'} name={'price'} onChange={this.handleChange}/>
          <Form.Input label={'Quantity'} name={'quantity'} onChange={this.handleChange}/>
        </Form> : <Form>
          <Form.Input label={'Stock Name'} name={'name'} onChange={this.handleChange}/>
        </Form>}
      </Modal.Content>
      <Modal.Actions>
        <Button onClick={this.handleAdd} positive>Add</Button>
        <Button onClick={this.handleClose}>Cancel</Button>
      </Modal.Actions>
    </Modal>)
  }
}