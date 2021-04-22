import React, {Component} from "react";
import {Button, Form, Header, Modal} from "semantic-ui-react";
import axios from "axios";
import {AXIOS_HEADER, BACKEND_URL} from "../defaults";


export default class RemoveStockModal extends Component {
  state = {
    openModal: false,
    stockList: this.props.stockList,
    stocksToRemove: [],
  };

  handleCheckBoxChange = (e, {value}) => {
    const {stocksToRemove} = this.state;
    let i = stocksToRemove.indexOf(value);
    if (i === -1) {
      this.setState({stocksToRemove: [...stocksToRemove, value]})
    } else {
      stocksToRemove.splice(i, 1)
    }
  };

  handleRemoveStock = () => {
    const {stocksToRemove} = this.state;
    const token = localStorage.getItem("token");
    if (token) {
      axios({
        headers: AXIOS_HEADER(token),
        method: 'delete', url: `${BACKEND_URL}/stocks/${this.props.pID}/deleteStock/`,
        data: {'stocks': stocksToRemove}
      }).then(() => {
        window.location.reload();
      }).catch(({response}) => {
        alert("Oops! " + response.data['error'])
      })
    }
    this.setState({openModal: false, stocksToRemove: []})
  };
  handleClose = () => this.setState({openModal: false});

  render() {
    const {openModal} = this.state;
    const {stockList} = this.props;
    return (<Modal size={'small'}
        open={openModal}
        trigger={<Button negative onClick={() => this.setState({openModal: true})}>Remove Stock</Button>}>
        <Modal.Header>Select a stock to remove</Modal.Header>
        <Modal.Content>
          <Form>
            {stockList && stockList.length > 0 ? <Form.Group grouped>
              {stockList.map(({id, name, profit}, i) => {
                profit = profit ? `- Profit: ${profit.toFixed(2)}` : '';
                return <Form.Checkbox
                  key={i} value={`${id}:${name}`} label={`${name} ${profit}`} onChange={this.handleCheckBoxChange}/>
              })}
            </Form.Group> : <Header disabled>No stocks to delete</Header>}
          </Form>
        </Modal.Content>
        <Modal.Actions>
          <Button onClick={this.handleRemoveStock} negative>Remove</Button>
          <Button onClick={this.handleClose}>Cancel</Button>
        </Modal.Actions>
      </Modal>
    )
  }
}
  