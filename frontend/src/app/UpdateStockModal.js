import React, {Component} from "react";
import {Button, Form, Modal, Icon, Divider, Container, Header, Message} from "semantic-ui-react";
import axios from "axios";
import {AXIOS_HEADER, BACKEND_URL} from "../defaults";

export default class UpdateStockModal extends Component {
  state = {
    price: '',
    quantity: '',
    action: 'buy',
    openModal: false,
    showError: false,
    errorMsg: ''
  };

  handleChange = (e, {name, value}) => {
    this.setState({[name]: value, showError: false});
  };
  handleClose = () => this.setState({openModal: false});
  handleDismiss = () => this.setState({showError: false});
  checkValues = (action, price, quantity) => {
    const {stock} = this.props;
    if (action === 'buy') {
      if (price && quantity) {
        if (!isNaN(parseFloat(price)) && !isNaN(parseFloat(quantity))) {
          return true
        }
      }
      this.setState({errorMsg: "Please enter a valid price and quantity value", showError: true});
      return false
    } else if (action === 'sell') {
      if (quantity > stock["quality"]) {
        this.setState({errorMsg: `You only have ${stock["quality"]} units to sell`, showError: true});
        return false
      } else {
        if (quantity && !isNaN(parseFloat(quantity))) {
          return true
        }
        this.setState({errorMsg: "Please enter a valid quantity value", showError: true});
        return false
      }
    }
  };

  updateStock = () => {
    const {stock} = this.props;
    const {price, quantity, action} = this.state;
    const token = localStorage.getItem("token");

    if (this.checkValues(action, price, quantity)) {
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
    }
  };

  render() {
    const {stock} = this.props;
    const {openModal, action, showError, errorMsg} = this.state;

    return <Modal size={'small'} open={openModal} trigger=
      {<Button icon basic onClick={() => this.setState({openModal: true})}><Icon name={'pencil'}/></Button>}>
      <Modal.Header>Update shares for <i>{stock['companyName']} ({stock['symbol']})</i></Modal.Header>
      <Modal.Content>
        <Container textAlign={'center'}>
          <Header as={'h4'}>Select an action:</Header>
          <Button.Group fluid>
            <Button onClick={() => this.setState({action: 'buy', showError: false})} color={action === 'buy' ? 'blue' : null}>Update</Button>
            <Button.Or/>
            <Button onClick={() => this.setState({action: 'sell', showError: false})} color={action === 'sell' ? 'blue' : null}>Sell</Button>
          </Button.Group>
        </Container>
        {action && action === 'buy' ? <Container>
          <Divider/>
          <Form>
            <Form.Group widths={'equal'}>
              <Form.Input label={'Buying price'} placeholder={'round to 2 decimal places'} name={'price'}
                          onChange={this.handleChange}/>
              <Form.Input label={'Quantity'} input={'number'} min={1} name={'quantity'} onChange={this.handleChange}/>
            </Form.Group>
            {showError && <Message negative onDismiss={this.handleDismiss} content={errorMsg}/>}
          </Form>
        </Container> : <Container>
          <Divider/>
          <Form>
            <Header align={'center'}><Header.Subheader>Available units: {stock["quality"]}</Header.Subheader></Header>
            <Form.Group widths={'equal'}>
              <Form.Input label={'Quantity'} input={'number'} min={1} name={'quantity'} onChange={this.handleChange}/>
            </Form.Group>
            {showError && <Message negative onDismiss={this.handleDismiss} content={errorMsg}/>}
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