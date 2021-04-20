import React, {Component} from "react";
import {Button, Form, Modal, Icon, Divider, Container, Header} from "semantic-ui-react";
import axios from "axios";
import {AXIOS_HEADER, BACKEND_URL} from "../defaults";

export default class UpdateStockModal extends Component {
  state = {
    price: '',
    quantity: '',
    openModal: false,
    action: 'buy'
  };

  handleChange = (e, {name, value}) => {
    this.setState({[name]: value});
  };

  handleClose = () => this.setState({openModal: false});


  updateStock = () => {
    const {stock} = this.props;
    const {price, quantity, action} = this.state;
    const token = localStorage.getItem("token");
    if (token) {
      let dataToSend = {'ticker': stock['symbol'], 'quantity': quantity, 'action': 'sell'};
      if (action === 'buy') {
        dataToSend['buying_price'] = price;
        dataToSend['action'] = 'buy'
      }
      axios({
        headers: AXIOS_HEADER(token),
        method: 'post', url: `${BACKEND_URL}/stocks/${this.props.pID}/updateStock/`,
        data: dataToSend
      }).then(() => {
        window.location.reload();
      }).catch(({response}) => {
        alert("Oops! " + response.data['error'])
      })
    }
  };


  render() {
    const {stock} = this.props;
    const {openModal, action} = this.state;

    return <Modal open={openModal} trigger={<Button icon basic onClick={() => this.setState({openModal: true})}>
      <Icon name={'pencil'}/></Button>}>
      <Modal.Header>Update shares for <i>{stock['companyName']} ({stock['symbol']})</i></Modal.Header>
      <Modal.Content>
        <Container textAlign={'center'}>
          <Header as={'h4'}>Select an action:</Header>
          <Button.Group fluid>
            <Button onClick={() => this.setState({action: 'buy'})} color={action === 'buy' ? 'blue' : null}>Buy</Button>
            <Button.Or/>
            <Button onClick={() => this.setState({action: 'sell'})}
                    color={action === 'sell' ? 'blue' : null}>Sell</Button>
          </Button.Group>
        </Container>
        {action && action === 'buy' ? <Container>
          <Divider/>
          <Form>
            <Form.Group widths={'equal'}>
              <Form.Input label={'Buying price'} placeholder={'round to 2 decimal places'} name={'price'}
                          onChange={this.handleChange}/>
              <Form.Input label={'Quantity'} name={'quantity'} onChange={this.handleChange}/>
            </Form.Group>
          </Form>
        </Container> : <Container>
          <Divider/>
          <Form>
            <Form.Group widths={'equal'}>
              <Form.Input label={'Quantity'} name={'quantity'} onChange={this.handleChange}/>
            </Form.Group>
          </Form>
        </Container>}
      </Modal.Content>
      <Modal.Actions>
        <Button onClick={this.updateStock} positive>Update</Button>
        <Button onClick={this.handleClose}>Cancel</Button>
      </Modal.Actions>
    </Modal>
  }
}