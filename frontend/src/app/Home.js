import React, {Component} from "react";
import {Segment, Header, Table, Dropdown, Button, Container, Divider, Loader, Grid} from "semantic-ui-react";
import NavBar from "./NavBar";
import axios from "axios";
import {AXIOS_HEADER, BACKEND_URL} from "../defaults";
import AddPortfolioModal from "./AddPortfolioModal";
import AddStockModal from "./AddStockModal";

export default class Home extends Component {
  state = {
    pID: '',
    pName: '',
    pType: '',
    pData: [],
    pOptions: [],
    showNoStockMsg: false,
    isLoading: false
  };

  componentDidMount() {
    this.setState({isLoading: true});
    const token = localStorage.getItem("token");
    if (token) {
      const pID = localStorage.getItem("p_id");
      const pName = localStorage.getItem("p_name");
      const pType = localStorage.getItem("p_type");
      axios({
        headers: AXIOS_HEADER(token),
        method: 'get', url: `${BACKEND_URL}/stocks/getPortfolios/`
      }).then(({data}) => {
        let options = [];
        data.forEach(({name, id, ptype}, i) => {
          options.push({key: i, value: `${id}:${name}:${ptype}`, text: name})
        });
        this.setState({pOptions: options, pID, pName, pType, isLoading: false});
        this.loadDefaultPortfolio(pID, pName);
      }).catch(() => {
        this.setState({showNoStockMsg: false})
      });
    }
  }

  loadDefaultPortfolio = (pID) => {
    const token = localStorage.getItem("token");
    if (token) {
      axios({
        headers: AXIOS_HEADER(token),
        method: 'get', url: `${BACKEND_URL}/stocks/${pID}/getStocks/`
      }).then(({data}) => {
        this.setState({pData: data});
      }).catch(() => {
        this.setState({showNoStockMsg: true})
      });
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
      showNoStockMsg:
        false, pData: []
    });
    const token = localStorage.getItem("token");
    if (token) {
      axios({
        headers: AXIOS_HEADER(token),
        method: 'get', url: `${BACKEND_URL}/stocks/${values[0]}/getStocks/`
      }).then(({data}) => {
        this.setState({pData: data});
      }).catch(() => {
        this.setState({showNoStockMsg: true})
      });
    }
  };

  render() {
    const {pID, pName, pType, pData, pOptions, showNoStockMsg, isLoading} = this.state;
    // These are the sample headers we can use to populate the table. We can change this depending on the data we get from the backend
    const transactionHeaderRow = ['Stock', 'Company', 'Buying Price', 'Latest Price', 'Quantity']; // 'Industry'];
    const renderTransactionBodyRow = ({symbol, companyName, buyingPrice, latestPrice, quality}, i) => ({
      key: i, cells: [symbol, companyName, buyingPrice, latestPrice, quality],
    });

    const watchlistHeaderRow = ['Stock', 'Company', 'Latest Price', 'Previous Close', 'Market Cap', 'Return YTD', 'PE Ratio', '52Wk Low', '52Wk High'];
    const renderWatchlistBodyRow = ({symbol, companyName, latestPrice, previousClose, marketCap, ytdChange, peRatio, week52High, week52Low}, i) => ({
      key: i,
      cells: [symbol, companyName, latestPrice, previousClose, marketCap, ytdChange, peRatio, week52High, week52Low],
    });


    return <React.Fragment>
      <NavBar/>
      <Container>
        <Segment className={'portfolio'}>
          {isLoading ? null : <Container>
            {pOptions && pOptions.length > 0 ?
              <Container>
                <Header as={'h4'}>Select a portfolio: </Header><Dropdown placeholder='Select a portfolio' fluid selection options={pOptions}
                          onChange={this.handleChangePortfolio} defaultValue={`${pID}:${pName}:${pType}`}/>
                <Divider section/>
                <Header textAlign={'center'} color={'teal'} as='h1'>
                  {pName}
                  <Header.Subheader>{pType}</Header.Subheader>
                </Header>
                <Divider hidden/>
                {showNoStockMsg ? <Grid textAlign={'center'}>
                  <Grid.Row>
                    <Header disabled as='h3'>It seems you don't have any stocks. Add one below to begin.</Header>
                  </Grid.Row>
                  <Grid.Row>
                    <AddStockModal pID={pID} pName={pName} pType={pType}/>
                  </Grid.Row>
                </Grid> : <React.Fragment>
                  {pID && pData && pData.length > 0 ? <Grid textAlign={'center'}>
                      <Grid.Row>
                        <Table
                          color={'teal'} celled tableData={pData}
                          headerRow={pType === 'Transaction' ? transactionHeaderRow : watchlistHeaderRow}
                          renderBodyRow={pType === 'Transaction' ? renderTransactionBodyRow : renderWatchlistBodyRow}/>
                      </Grid.Row>
                      <Grid.Row>
                        <AddStockModal pID={pID} pName={pName} pType={pType}/>
                        {pData && pData.length > 0 && <Button color={'red'}>Remove Stock</Button>}
                      </Grid.Row>
                    </Grid>
                    : <Loader active inline='centered'/>}

                </React.Fragment>}
              </Container> : <Container textAlign={'center'}>
                <Header disabled as='h2'>It seems you don't have any portfolios
                  <Header.Subheader disabled as='h2'>Add one below to begin</Header.Subheader>
                </Header>
                <AddPortfolioModal/>
              </Container>}
          </Container>}
        </Segment>
      </Container>
    </React.Fragment>
  }
}
