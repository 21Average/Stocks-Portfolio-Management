import React, {Component} from "react";
import {Segment, Container, Header, Table, Divider, Loader} from "semantic-ui-react";
import NavBar from "./NavBar";
import axios from "axios";
import {AXIOS_HEADER, BACKEND_URL} from "../defaults";

export default class Dashboard extends Component {
  state = {
    portfolioData: '',
    articles: [],
  };

  componentDidMount() {
    const token = localStorage.getItem("token");
    if (token) {
      this.setState({isLoading: true});
      axios({
        headers: AXIOS_HEADER(token),
        method: 'get', url: `${BACKEND_URL}/stocks/getPortfoliosSummary/`
      }).then(({data}) => {
        this.setState({portfolioData: data, isLoading: false});
      }).catch(({response}) => {
        alert('Oops! ' + (response.data['error']));
        this.setState({isLoading: false})
      });
    }
  }

  numberWithComma = (x) => {
    return x ? x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : ''
  };

  render() {
    const {portfolioData, data, articles} = this.state;
    const headerRow = ['Portfolio', 'Total Gain/Loss', 'Number of Stocks'];
    console.log(data);

    return <React.Fragment>
      <NavBar/>
      <Container>
        <Segment className={'portfolio'}>
          <Container>
            {portfolioData ? <React.Fragment>
              <Header>Portfolio Overview</Header>
              <Table basic='very' celled>
                <Table.Header>
                  <Table.Row>
                    {headerRow.map((header, i) =>
                      <Table.HeaderCell key={i}>{header}</Table.HeaderCell>)}
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {portfolioData.map(({name, totalGL, numStocks}, i) => {
                    let gainLossColour = totalGL >= 0 ? (totalGL > 0 ? 'green' : null) : 'red';
                    let gainLossSymbol = totalGL > 0 ? '+' : '';
                    return <Table.Row key={i}>
                      <Table.Cell>{name}</Table.Cell>
                      <Table.Cell><p
                        style={{color: gainLossColour}}>{totalGL ? `${gainLossSymbol}${this.numberWithComma(totalGL.toFixed(2))}` : '-'}</p>
                      </Table.Cell>
                      <Table.Cell>{numStocks ? this.numberWithComma(numStocks) : '-'}</Table.Cell>
                    </Table.Row>
                  })}
                </Table.Body>
              </Table>
            </React.Fragment> : <Loader active/>}
          </Container>
          <Container>
            <Divider hidden/>
            <Header>News</Header>
            {articles ? <Container>hi</Container> : null}
          </Container>
        </Segment>
      </Container>
    </React.Fragment>
  }
}
