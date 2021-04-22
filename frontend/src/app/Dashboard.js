import React, {Component} from "react";
import {Segment, Container, Header, Table, Divider, Card, Image} from "semantic-ui-react";
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
        // alert('Oops! ' + (response.data['error']));
        this.setState({isLoading: false})
      });
      axios({
        headers: AXIOS_HEADER(token),
        method: 'get', url: `${BACKEND_URL}/stocks/getStocksNews/`
      }).then(({data}) => {
        this.setState({articles: data, isLoading: false})
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
    const {portfolioData, articles} = this.state;
    const headerRow = ['Portfolio', 'Total Gain/Loss', 'Number of Stocks'];

    return <React.Fragment>
      <NavBar/>
      <Container>
        <Segment className={'portfolio'}>
          <Container>
            {portfolioData && <React.Fragment>
              <Header as={'h1'}>Portfolio Overview</Header>
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
            </React.Fragment>}
          </Container>
          <Container>
            {portfolioData && articles && <Divider section/>}
            {articles ? <Container>
              <Header as={'h1'}>Latest News</Header>
              <Card.Group stackable>
                {articles.map(({image, publishedDate, site, symbol, text, title, url}, i) => {
                  let heading = title.length < 50 ? title : title.substring(0, 50) + '...';
                  let desc = text.length < 100 ? text : text.substring(0, 100) + '...';
                  let published = new Date(publishedDate).toLocaleDateString();
                  return <Card key={i} href={url} link target="_blank">
                    <Image src={image} wrapped ui={false}/>
                    <Card.Content>
                      <Card.Header>{heading}</Card.Header>
                      <Card.Meta>Published: {published}</Card.Meta>
                      <Card.Description>
                        {desc}
                      </Card.Description>
                    </Card.Content>
                    <Card.Content extra>
                      <a href={url}>{site} (Stock: {symbol})</a>
                    </Card.Content>
                  </Card>
                })}
              </Card.Group>
            </Container> : null}
          </Container>
        </Segment>
      </Container>
    </React.Fragment>
  }
}
