import React, {Component} from "react";
import {Segment, Header, Table, Dropdown, Button, Container, Divider} from "semantic-ui-react";
import NavBar from "./NavBar";

export default class Login extends Component {
  // State is where you store values that the render() function will use
  state = {
    portfolioName: ""
  };

  // Process:
  // (1) User clicks on value
  // (2) Value sent to backend via api call
  // (3) Backend send backs data relating to portfolio
  // (4) Render out data

  handleChange = (e, {value}) => {
    // Once we've got the backend setup, this will update the data and show the correct portfolio
    this.setState({portfolioName: value});
  };

  // The render() function is what the user sees. The return value is what is rendered out on the page
  render() {
    const {portfolioName} = this.state; // This is how to get the data you stored in "state"

    // These are the sample headers we can use to populate the table. We can change this depending on the data we get from the backend
    const headerRow = ['Stock', 'Quantity', 'Purchase Date', 'Purchase Price', 'Market', 'Industry'];
    const tableData = [{}];
    const renderBodyRow = ({stock, quantity, date, price, market, industry}, i) => ({
      key: i, cells: [stock, quantity, date, price, market, industry],
    });

    // This will be populated with the user's portfolios once we've gotten the data from the backend
    const portfolioOptions = [
      {key: 'p1', text: 'Portfolio 1', value: 'Portfolio 1'},
      {key: 'p2', text: 'Portfolio 2', value: 'Portfolio 2'},
      {key: 'p3', text: 'Portfolio 3', value: 'Portfolio 3'},
      {key: 'p4', text: 'Portfolio 4', value: 'Portfolio 4'},
      {key: 'p5', text: 'Portfolio 5', value: 'Portfolio 5'},
    ];

    return <React.Fragment>
      <NavBar/>
      <Container>
        <Segment className={'portfolio'}>
          <Dropdown
            placeholder='Select a portfolio' fluid selection options={portfolioOptions} onChange={this.handleChange}/>
          {portfolioName ? <Container>
            <br/>
            <Header as='h2' color={'teal'} textAlign={'center'}>{portfolioName}</Header>
            <Divider hidden/>
            <Table color={'teal'} celled headerRow={headerRow} renderBodyRow={renderBodyRow} tableData={tableData}/>
            <Button color={'green'}>Add Stock</Button>
            <Button color={'red'}>Remove Stock</Button>
          </Container> : <Header color={'grey'} textAlign={'center'}>Please select a portfolio</Header>}
        </Segment>
      </Container>
    </React.Fragment>
  }
}
