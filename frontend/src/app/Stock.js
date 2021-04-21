import React, {Component} from "react";
import {Segment, Container, Header, Divider, Button, Menu, Grid, Table, Loader, Icon, Label} from "semantic-ui-react";
import NavBar from "./NavBar";
import history from "../history";
import axios from "axios";
import {AXIOS_HEADER, BACKEND_URL} from "../defaults";
import PerformanceChart from "./PerformanceChart";
import PricePredictionChart from "./PricePredictionChart";


export default class Stock extends Component {
  state = {
    symbol: '',
    name: '',
    activeItem: 'historical data',
    lastUpdated: '',
    stockInfo: {},
    stockHistory: {},
    stockPrediction: {},
    rangeSelected: '6m',
    isStockLoading: false,
    showError: false,
    errorMsg: ''
  };

  componentDidMount() {
    const {symbol} = this.props.match.params;
    const {rangeSelected} = this.state;
    let date = new Date();
    const token = localStorage.getItem("token");
    if (token) {
      axios({
        headers: AXIOS_HEADER(token),
        method: 'post', url: `${BACKEND_URL}/stocks/getStock/`,
        data: {'ticker': symbol}
      }).then(({data}) => {
        this.setState({stockInfo: data, name: data["companyName"]})
      }).catch(({response}) => {
        alert("Oops! " + response.data['error'])
      });
      axios({
        headers: AXIOS_HEADER(token),
        method: 'post', url: `${BACKEND_URL}/stocks/getStockPrediction/`,
        data: {'ticker': symbol}
      }).then(({data}) => {
        this.setState({stockPrediction: data})
      }).catch(() => {
        this.setState({showError: true, errorMsg: "Price prediction currently not available", stockPrediction: {}})

      });
      axios({
        headers: AXIOS_HEADER(token),
        method: 'post', url: `${BACKEND_URL}/stocks/getStockHistory/`,
        data: {'ticker': symbol, 'range': rangeSelected}
      }).then(({data}) => {
        this.setState({stockHistory: data})
      }).catch(() => {
        this.setState({showError: true, errorMsg: "Historical data currently not available", stockHistory: {}})
      });
    }
    this.setState({symbol, lastUpdated: date.toLocaleString('en-AU')});
  }

  numberWithComma = (x) => {
    return x ? x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : ''
  };

  handleItemClick = (e, {name}) => this.setState({activeItem: name});

  refreshInfo = () => {
    const {symbol} = this.state;
    this.setState({isStockLoading: true});
    const token = localStorage.getItem("token");
    if (token) {
      axios({
        headers: AXIOS_HEADER(token),
        method: 'post', url: `${BACKEND_URL}/stocks/getStock/`,
        data: {'ticker': symbol}
      }).then(({data}) => {
        let date = new Date();
        this.setState({
          stockInfo: data,
          name: data["companyName"],
          lastUpdated: date.toLocaleString('en-AU'),
          isStockLoading: false,
        })
      }).catch(({response}) => {
        alert("Oops! " + response.data['error']);
        this.setState({isStockLoading: false})
      });
    }
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
    const {name, symbol, activeItem, lastUpdated, stockInfo, stockHistory, stockPrediction, rangeSelected, isStockLoading, showError, errorMsg} = this.state;
    const intervals = ['1d', '5d', '1m', '6m', 'ytd', '1y', '5y'];
    let data, data2, percent, percentSymbol, percentColour;
    if (stockInfo) {
      data = [
        {key: "Market Cap", value: stockInfo["marketCap"] ? `$${this.numberWithComma(stockInfo["marketCap"])}` : '-'},
        {key: "PE Ratio", value: stockInfo["peRatio"] ? stockInfo["peRatio"] : '-'},
        {key: "Previous Close", value: stockInfo["previousClose"] ? `$${stockInfo["previousClose"]}` : '-'},
      ];
      data2 = [
        {key: "52 Week High", value: stockInfo["week52High"] ? `$${stockInfo["week52High"].toFixed(2)}` : '-'},
        {key: "52 Week Low", value: stockInfo["week52Low"] ? `$${stockInfo["week52Low"].toFixed(2)}` : '-'},
        {key: "YTD Change", value: stockInfo["ytdChange"] ? `${(stockInfo["ytdChange"] * 100).toFixed(2)}%` : '-'},
      ];
      percent = (stockInfo["changePercent"] * 100).toFixed(2);
      percentSymbol = percent > 0 ? '+' : '';
      percentColour = percent >= 0 ? (percent > 0 ? 'green' : null) : 'red';
    }

    // historical data, related news, price prediction
    let view = (display) => {
      if (display === 'historical data') {
        return <Container align={'center'}>
          <Header as={'h3'}>Historical Data</Header>
          {showError ? <p style={{color: 'grey'}}>{errorMsg}</p> : <Grid columns={2} style={{minHeight: "530px"}}>
            <Grid.Column align={'right'} verticalAlign={'middle'} width={2}>
              {intervals.map((interval, i) => <p key={i}><Button
                style={{width: '70px'}} name={interval} color={rangeSelected === interval ? 'teal' : null}
                onClick={() => this.handleChangeInterval(interval)}>{interval.toUpperCase()}</Button>
              </p>)}
            </Grid.Column>
            <Grid.Column width={14}>
              {stockHistory && stockHistory["close_data"] && stockHistory["volume_data"] ?
                <PerformanceChart closeData={stockHistory["close_data"]}
                                  volumeData={stockHistory["volume_data"]}/> : <Loader active/>}
            </Grid.Column>
          </Grid>}
        </Container>
      } else if (display === 'related news') {
        return <Container align={'center'}>
          <Header>Related News</Header>
        </Container>
      } else if (display === 'price prediction') {
        return <Container align={'center'}>
          <Header as={'h3'}>Price Prediction</Header>
          {showError ? <p style={{color: 'grey'}}>{errorMsg}</p> : <Grid centered>
            <Grid.Row style={{minHeight: '430px'}}>
              {stockPrediction && stockPrediction["close_data"] && stockPrediction["prediction_data"] ?
                <PricePredictionChart closeData={stockPrediction["close_data"]}
                                      predictionData={stockPrediction["prediction_data"]}/> :
                <Loader active>Calculating predictions...</Loader>}
            </Grid.Row>
            <Grid.Row>
              <Label color={'teal'} size={'large'}>Historical data</Label>
              <Label color={'yellow'} size={'large'}>Predicted prices</Label>
            </Grid.Row>
          </Grid>}
        </Container>
      }
    };

    return <React.Fragment>
      <NavBar/>
      <Container>
        <Segment className={'portfolio'}>
          {stockInfo && stockInfo["symbol"] ? <React.Fragment>
            <Button content={'Back'} icon={'left arrow'} labelPosition={'left'} size={'small'}
                    onClick={() => history.push('/portfolio')}/>
            <Header align={'center'} as={'h1'}>{name}
              <Header.Subheader>({symbol})</Header.Subheader>
            </Header>
            <Divider/>
            {isStockLoading ? <Container align={'center'} verticalAlign={'middle'} style={{minHeight: '120px'}}>
              <Icon name='spinner' loading/></Container> : <Grid columns={3}>
              <Grid.Column verticalAlign={'middle'}>
                <Header size={'large'}><Header.Subheader>Last Price
                  (USD):</Header.Subheader>${stockInfo["latestPrice"]}
                </Header>
                <Header size={'large'} color={percentColour}><Header.Subheader>Today's
                  change:</Header.Subheader>{percentSymbol + percent}%</Header>
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
            </Grid>}
            <Divider/>
            <Grid columns={2}>
              <Grid.Column>
                <p style={{color: 'grey'}}>Last updated: {lastUpdated}</p>
              </Grid.Column>
              <Grid.Column align={'right'}>
                <Button content={'Refresh'} labelPosition={'left'} size={'small'} icon={'refresh'}
                        onClick={this.refreshInfo}/>
              </Grid.Column>
            </Grid>
            <Divider hidden/>
            <Menu pointing secondary>
              <Menu.Item
                name='historical data'
                icon='chart bar outline'
                active={activeItem === 'historical data'}
                onClick={this.handleItemClick}
              />
              <Menu.Item
                name='related news'
                icon='newspaper outline'
                active={activeItem === 'related news'}
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
          </React.Fragment> : <Loader active>Fetching data... Please wait</Loader>}
        </Segment>
      </Container>
    </React.Fragment>
  }
}