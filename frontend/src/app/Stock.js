import React, {Component} from "react";
import {Segment, Container, Header, Divider, Button, Menu, Grid, Table} from "semantic-ui-react";
import NavBar from "./NavBar";
import history from "../history";


export default class Stock extends Component {
  state = {
    symbol: '',
    name: '',
    pType: '',
    activeItem: 'price prediction', // need a better name?
    lastUpdated: ''
  };

  componentDidMount() {
    const {symbol} = this.props.match.params;
    const pType = this.props.location.state.pType;
    // TODO: change this to an API call to the backend. Use symbol to get stock's details
    const name = this.props.location.state.name;
    let date = new Date();
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

  render() {
    const {name, symbol, activeItem, lastUpdated} = this.state;

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

    let view = (display) => {
      if (display === 'price prediction') {
        return <Container align={'center'}>
          <Header>Price Prediction</Header>
        </Container>
      } else if (display === 'news') {
        return <Container align={'center'}>
          <Header>News</Header>
        </Container>
      } else if (display === 'graph') {
        return <Container align={'center'}>
          <Header>Graph stuff</Header>
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
              name='price prediction'
              icon='chart line'
              active={activeItem === 'price prediction'}
              onClick={this.handleItemClick}
            />
            <Menu.Item
              name='news'
              icon='newspaper outline'
              active={activeItem === 'news'}
              onClick={this.handleItemClick}
            />
            <Menu.Item
              name='graph'
              icon='chart bar outline'
              active={activeItem === 'graph'}
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