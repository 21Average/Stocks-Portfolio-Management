import React, {Component} from "react";
import {Segment, Header, Table, Dropdown, Button, Container, Divider, Modal, Form} from "semantic-ui-react";
import NavBar from "./NavBar";

export default class Login extends Component {
  state = {
    portfolioName: '',
    portfolioData: [],
    portfolioOptions: [],
    openAddPortfolioModal: false,
    portfolioNameValue: '',
    portfolioTypeValue: '',
  };

  // Process:
  // (1) User clicks on value
  // (2) Value sent to backend via api call
  // (3) Backend send backs data relating to portfolio
  // (4) Render out data

  handleChangePortfolio = (e, {value}) => {
    // Once we've got the backend setup, this will update the data and show the correct portfolio
    this.setState({portfolioName: value});
  };

  handlePortNameChange = (e, {value}) => {
    this.setState({portfolioNameValue: value});
  };
  handlePortTypeChange = (e, {value}) => {
    this.setState({portfolioTypeValue: value});
  };

  handleCreatePortfolio = () => {
    const {portfolioNameValue, portfolioTypeValue} = this.state;
    let newPortfolio = {
      key: portfolioNameValue + portfolioTypeValue, // need to change to something unique
      text: portfolioNameValue,
      value: portfolioNameValue
    };
    this.setState({openAddPortfolioModal: false, portfolioOptions: [...this.state.portfolioOptions, newPortfolio]});
  };

  handleCloseModal = () => {
    this.setState({openAddPortfolioModal: false})
  };

  render() {
    const {portfolioName, portfolioData, portfolioOptions, openAddPortfolioModal, portfolioTypeValue} = this.state; // This is how to get the data you stored in "state"

    // These are the sample headers we can use to populate the table. We can change this depending on the data we get from the backend
    const headerRow = ['Stock', 'Quantity', 'Purchase Date', 'Purchase Price', 'Market', 'Industry'];
    const renderBodyRow = ({stock, quantity, date, price, market, industry}, i) => ({
      key: i, cells: [stock, quantity, date, price, market, industry],
    });

    return <React.Fragment>
      <NavBar/>
      <Container>
        {portfolioOptions && portfolioOptions.length <= 0 ? <Segment className={'portfolio'}>
          <Container textAlign={'center'}>
            <Header disabled as='h2'>It seems you don't have any portfolios</Header>
            <Header disabled as='h2'>Add one below to begin</Header>
            <br/>
            <Modal open={openAddPortfolioModal} size={'small'}
                   trigger={<Button align={'center'} color={'green'} size={'large'}
                                    onClick={() => this.setState({openAddPortfolioModal: true})}>Add
                     portfolio</Button>}>
              <Header as={'h1'}>Create a new portfolio</Header>
              <Modal.Content>
                <Form>
                  <Form.Input label={'Portfolio name'} onChange={this.handlePortNameChange}/>
                  <Form.Group inline>
                    <label>Type</label>
                    <Form.Radio
                      label='Transaction'
                      value='transaction'
                      checked={portfolioTypeValue === 'transaction'}
                      onChange={this.handlePortTypeChange}
                    />
                    <Form.Radio
                      label='Watchlist'
                      value='watchlist'
                      checked={portfolioTypeValue === 'watchlist'}
                      onChange={this.handlePortTypeChange}
                    />
                  </Form.Group>
                </Form>
              </Modal.Content>
              <Modal.Actions>
                <Button onClick={this.handleCreatePortfolio} positive>Create</Button>
                <Button onClick={this.handleCloseModal}>Cancel</Button>
              </Modal.Actions>
            </Modal>
          </Container>
        </Segment> : <Segment className={'portfolio'}>
          <Dropdown
            placeholder='Select a portfolio' fluid selection options={portfolioOptions}
            onChange={this.handleChangePortfolio}/>
          {portfolioName ? <Container>
            <br/>
            <Header as='h2' color={'teal'} textAlign={'center'}>{portfolioName}</Header>
            <Divider hidden/>
            <Table color={'teal'} celled headerRow={headerRow} renderBodyRow={renderBodyRow} tableData={portfolioData}/>
            <Button color={'green'}>Add Stock</Button>
            <Button color={'red'}>Remove Stock</Button>
          </Container> : <Header color={'grey'} textAlign={'center'}>Please select a portfolio</Header>}
        </Segment>}
      </Container>
    </React.Fragment>
  }
}
