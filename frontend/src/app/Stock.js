import React, {Component} from "react";
import {Segment, Container, Header, Divider, Button, Menu, Grid, Table, Loader} from "semantic-ui-react";
import NavBar from "./NavBar";
import history from "../history";
import axios from "axios";
import {AXIOS_HEADER, BACKEND_URL} from "../defaults";
import PerformanceChart from "./PerformanceChart";


export default class Stock extends Component {
  state = {
    symbol: '',
    name: '',
    pType: '',
    activeItem: 'performance', // need a better name?
    lastUpdated: '',
    stockHistory: {},
    rangeSelected: '6m'
  };

  componentDidMount() {
    const {symbol} = this.props.match.params;
    const pType = this.props.location.state.pType;
    const {rangeSelected} = this.state;
    // TODO: change this to an API call to the backend. Use symbol to get stock's details
    const name = this.props.location.state.name;
    let date = new Date();
    const token = localStorage.getItem("token");
    if (token) {
      axios({
        headers: AXIOS_HEADER(token),
        method: 'post', url: `${BACKEND_URL}/stocks/getStockHistory/`,
        data: {'ticker': symbol, 'range': rangeSelected}
      }).then(({data}) => {
        this.setState({stockHistory: data})
      }).catch(({response}) => {
        alert("Oops! " + response.data['error'])
      });
    }
    this.setState({symbol, name, pType, lastUpdated: date.toLocaleString('en-US')});
  }

  numberWithCommas = (x) => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };
  handleItemClick = (e, {name}) => this.setState({activeItem: name});

  refreshInfo = () => {
    // TODO: refresh page with stock info
    let date = new Date();
    this.setState({lastUpdated: date.toLocaleString('en-US')})
  };

  handleChangeInterval = (interval) => {
    this.setState({stockHistory: {}, rangeSelected: interval});
    const {symbol} = this.props.match.params;
    const token = localStorage.getItem("token");
    if (token) {
      axios({
        headers: AXIOS_HEADER(token),
        method: 'post', url: `${BACKEND_URL}/stocks/getStockHistory/`,
        data: {'ticker': symbol, 'range': interval}
      }).then(({data}) => {
        this.setState({stockHistory: data})
      }).catch(({response}) => {
        alert("Oops! " + response.data['error'])
      });
    }
  };

  render() {
    const {name, symbol, activeItem, lastUpdated, stockHistory, rangeSelected} = this.state;

    // dummy data to delete
    let data = [
      {key: "Market Cap", value: "916,036,721,961"},
      {key: "PE Ratio", value: 31.55},
      {key: "Previous Close", value: "$321.25"},
    ];
    let data2 = [
      {key: "52 Week High", value: "$327.78"},
      {key: "52 Week Low", value: "$174.54"},
      {key: "YTD Change", value: 0.14},
    ];

    let intervals = ['1d', '5d', '1m', '6m', 'ytd', '1y', '5y'];

    let view = (display) => {
      if (display === 'performance') {
        return <Container align={'center'}>
          <Grid columns={2} centered style={{minHeight: "530px", padding: "0px"}}>
            <Grid.Column align={'right'} verticalAlign={'middle'} width={2}>
              {intervals.map((interval, i) => <p key={i}><Button style={{width: '70px'}}
                name={interval} color={rangeSelected === interval ? 'blue' : null}
                onClick={() => this.handleChangeInterval(interval)}>{interval.toUpperCase()}</Button>
              </p>)}
            </Grid.Column>
            <Grid.Column align={'left'} width={14}>
              {stockHistory && stockHistory["close_data"] && stockHistory["volume_data"] ?
                <PerformanceChart closeData={stockHistory["close_data"]}
                                  volumeData={stockHistory["volume_data"]}/> : <Loader active/>}
            </Grid.Column>
          </Grid>
        </Container>
      } else if (display === 'price prediction') {
        return <Container align={'center'}>
          <Header>Price Prediction</Header>
        </Container>
      } else if (display === 'news') {
        return <Container align={'center'}>
          <Header>News</Header>
        </Container>
      }
    };

    return <React.Fragment>
      <NavBar/>
      <Container>
        <Segment className={'portfolio'}>
          <Button content={'Back'} icon={'left arrow'} labelPosition={'left'} size={'small'}
                  onClick={() => history.push('/portfolio')}/>
          <Header align={'center'} as={'h1'}>{name}
            <Header.Subheader>({symbol})</Header.Subheader>
          </Header>
          <Divider/>
          <Grid columns={3}>
            <Grid.Column verticalAlign={'middle'}>
              <Header size={'large'}><Header.Subheader>Last Price (USD):</Header.Subheader> $315.43
              </Header>
              <Header size={'large'} color={'green'}><Header.Subheader>Today's change:</Header.Subheader>0.09%</Header>
            </Grid.Column>
            <Grid.Column>
              <Table basic={'very'}>
                <Table.Body>
                  {data.map(({key, value}, i) =>
                    <Table.Row key={i}>
                      <Table.Cell collapsing>{key}</Table.Cell>
                      <Table.Cell><b>{value}</b></Table.Cell>
                    </Table.Row>
                  )}
                </Table.Body>
              </Table>
            </Grid.Column>
            <Grid.Column>
              <Table basic={'very'}>
                <Table.Body>
                  {data2.map(({key, value}, i) =>
                    <Table.Row key={i}>
                      <Table.Cell collapsing>{key}</Table.Cell>
                      <Table.Cell><b>{value}</b></Table.Cell>
                    </Table.Row>
                  )}
                </Table.Body>
              </Table>
            </Grid.Column>
          </Grid>
          <Divider/>
          <Grid columns={2}>
            <Grid.Column>
              <p style={{color: 'grey'}}>Last updated: {lastUpdated}</p>
            </Grid.Column>
            <Grid.Column align={'right'}>
              <Button primary content={'Refresh'} labelPosition={'left'} size={'small'} icon={'refresh'}
                      onClick={this.refreshInfo}/>
            </Grid.Column>
          </Grid>
          <Divider hidden/>
          <Menu pointing secondary>
            <Menu.Item
              name='performance'
              icon='chart bar outline'
              active={activeItem === 'performance'}
              onClick={this.handleItemClick}
            />
            <Menu.Item
              name='news'
              icon='newspaper outline'
              active={activeItem === 'news'}
              onClick={this.handleItemClick}
            />
            <Menu.Item
              name='price prediction'
              icon='chart line'
              active={activeItem === 'price prediction'}
              onClick={this.handleItemClick}
            />
          </Menu>
          <br/>
          {activeItem && view(activeItem)}
        </Segment>
      </Container>
    </React.Fragment>
  }
}