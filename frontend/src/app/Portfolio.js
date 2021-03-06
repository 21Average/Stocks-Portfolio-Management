import React, {Component} from "react";
import {Segment, Header, Dropdown, Container, Divider, Grid, Loader, Button, Icon} from "semantic-ui-react";
import NavBar from "./NavBar";
import axios from "axios";
import history from "../history"
import {AXIOS_HEADER, BACKEND_URL} from "../defaults";
import AddPortfolioModal from "./AddPortfolioModal";
import AddStockModal from "./AddStockModal";
import PortfolioTable from "./PortfolioTable";

export default class Portfolio extends Component {
  state = {
    pID: '',
    pName: '',
    pType: '',
    pData: [],
    pOptions: [],
    showNoStockMsg: false,
    isLoading: false,
    isTableLoading: false,
    portfolioSelected: false,
    portfolioValue: 0,
    todayGainLoss: 0,
    totalGainLoss: 0
  };

  componentDidMount() {
    this.setState({isLoading: true});
    const token = localStorage.getItem("token");
    if (token) {
      const pID = localStorage.getItem("p_id");
      const pName = localStorage.getItem("p_name");
      const pType = localStorage.getItem("p_type");
      // get portfolios
      axios({
        headers: AXIOS_HEADER(token),
        method: 'get', url: `${BACKEND_URL}/stocks/getPortfolios/`
      }).then(({data}) => {
        let options = [];
        data.forEach(({name, id, ptype}, i) => {
          options.push({key: i, value: `${id}:${name}:${ptype}`, text: name})
        });
        this.setState({pOptions: options, isLoading: false});
        if (pID && pName) {
          this.setState({pID, pName, pType});
          this.loadDefaultPortfolio(pID, pName);
        }
      }).catch(() => {
        this.setState({showNoStockMsg: false})
      });
    }
  }

  calculatePortfolioValue = (data) => {
    let portfolioValue = 0;
    data.forEach(({latestPrice, quality}) => {
      portfolioValue += (latestPrice * quality)
    });
    this.setState({portfolioValue})
  };

  calculateTodayGainLoss = (data) => {
    let todayGainLoss = 0;
    data.forEach(({latestPrice, previousClose, quality}) => {
      todayGainLoss += ((latestPrice - previousClose) * quality)
    });
    this.setState({todayGainLoss})
  };


  calculateTotalGainLoss = (data) => {
    let totalGainLoss = 0;
    data.forEach(({profit}) => {
      totalGainLoss += profit
    });
    this.setState({totalGainLoss})
  };

  loadDefaultPortfolio = (pID) => {
    this.setState({isTableLoading: true});
    const token = localStorage.getItem("token");
    if (token) {
      this.getStocks(token, pID);
    }
  };

  handleChangePortfolio = (e, {value}) => {
    let values = value.split(':');
    // set default profile to last selected
    localStorage.setItem("p_id", values[0]);
    localStorage.setItem("p_name", values[1]);
    localStorage.setItem("p_type", values[2]);
    this.setState({
      pID: values[0],
      pName: values[1],
      pType: values[2],
      pData: [],
      isTableLoading: true,
    });
    const token = localStorage.getItem("token");
    if (token) {
      this.getStocks(token, values[0]);
    }
  };

  getStocks = (token, pID) => {
    axios({
      headers: AXIOS_HEADER(token),
      method: 'get', url: `${BACKEND_URL}/stocks/${pID}/getStocks/`
    }).then(({data}) => {
      this.setState({pData: data, portfolioSelected: true, isTableLoading: false});
      this.calculatePortfolioValue(data);
      this.calculateTodayGainLoss(data);
      this.calculateTotalGainLoss(data);
    }).catch(({response}) => {
      this.setState({showNoStockMsg: true, portfolioSelected: true, isTableLoading: false});
    });
  };

  numberWithComma = (x) => {
    return x ? x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : '-'
  };

  render() {
    const {pID, pName, pType, pData, pOptions, isLoading, isTableLoading, portfolioSelected, portfolioValue, todayGainLoss, totalGainLoss} = this.state;

    let getColor = (value) => value >= 0 ? (value > 0 ? 'green' : null) : 'red';
    let getSymbol = (value) => value > 0 ? '+' : '';

    return <React.Fragment>
      <NavBar/>
      <Container>
        <Segment className={'portfolio'}>
          {isLoading ? null : <Container>
            {pOptions && pOptions.length > 0 ? <Container>
              <Grid columns={'equal'}>
                <Grid.Column width={12}>
                  <Dropdown placeholder='Select a portfolio' fluid selection options={pOptions}
                            onChange={this.handleChangePortfolio} defaultValue={`${pID}:${pName}:${pType}`}/>
                </Grid.Column>
                <Grid.Column align={'right'}>
                  <Button icon labelPosition={'right'} onClick={() => history.push('/portfolio/all')}><Icon
                    name='right arrow'/>View all portfolios</Button>
                </Grid.Column>
              </Grid>
              <Header as='h1'>{pName}<Header.Subheader>{pType}</Header.Subheader></Header>
              <Divider/>
              {isTableLoading ? <Loader active inline='centered'/> : <React.Fragment>
                {portfolioSelected && <React.Fragment>
                  {pData && pData.length > 0 ? <Container>
                    {pType === 'Transaction' && <Container>
                      <br/>
                      <Grid columns={3}>
                        <Grid.Column>
                          <Header><Header.Subheader>Portfolio
                            Value: </Header.Subheader>${this.numberWithComma(portfolioValue.toFixed(2))}</Header>
                        </Grid.Column>
                        <Grid.Column>
                          <Header color={getColor(todayGainLoss)}><Header.Subheader>Today's Gain/Loss ($):
                          </Header.Subheader>{getSymbol(todayGainLoss)}{this.numberWithComma(todayGainLoss.toFixed(2))}
                          </Header>
                        </Grid.Column>
                        <Grid.Column>
                          <Header color={getColor(totalGainLoss)}><Header.Subheader>Total Gain/Loss ($):
                          </Header.Subheader>{getSymbol(totalGainLoss)}{this.numberWithComma(totalGainLoss.toFixed(2))}
                          </Header>
                        </Grid.Column>
                      </Grid>
                      <br/>
                    </Container>}
                    <PortfolioTable pData={pData} pID={pID} pName={pName} pType={pType}/>
                  </Container> : <Grid textAlign={'center'}>
                    <Grid.Row>
                      <Header disabled as='h3'>It seems you don't have any stocks. Add one below to begin.</Header>
                    </Grid.Row>
                    <Grid.Row>
                      <AddStockModal pID={pID} pName={pName} pType={pType}/>
                    </Grid.Row>
                  </Grid>}
                </React.Fragment>} </React.Fragment>} </Container> : <Container textAlign={'center'}>
              <Header disabled as='h2'>It seems you don't have any portfolios
                <Header.Subheader>Add one below to begin</Header.Subheader>
              </Header>
              <AddPortfolioModal/>
            </Container>}
          </Container>}
        </Segment>
      </Container>
    </React.Fragment>
  }
}
