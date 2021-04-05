import React, {Component} from "react";
import {Segment, Header, Table, Dropdown, Button, Container, Divider, Loader} from "semantic-ui-react";
import NavBar from "./NavBar";
import axios from "axios";
import {AXIOS_HEADER, BACKEND_URL} from "../defaults";
import AddPortfolioModal from "./AddPortfolioModal";
import AddStockModal from "./AddStockModal";

export default class Login extends Component {
  state = {
    pID: '',
    pName: '',
    pData: [],
    pOptions: [],
    showNoStockMsg: false,
  };

  componentDidMount() {
    const token = localStorage.getItem("token");
    if (token) {
      const pID = localStorage.getItem("p_id");
      const pName = localStorage.getItem("p_name");

      axios({
        headers: AXIOS_HEADER(token),
        method: 'get', url: `${BACKEND_URL}/stocks/getPortfolios/`
      }).then(({data}) => {
        let options = [];
        data.forEach(({name, id}, i) => {
          options.push({key: i, value: id + ':' + name, text: name})
        });
        this.setState({pOptions: options, pID, pName});
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
    this.setState({
      pID: values[0],
      pName: values[1],
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
    const {pID, pName, pData, pOptions, showNoStockMsg} = this.state;
    // These are the sample headers we can use to populate the table. We can change this depending on the data we get from the backend
    const headerRow = ['Stock', 'Company', 'Buying Price', 'Latest Price', 'Quantity']; // 'Industry'];
    const renderBodyRow = ({symbol, companyName, buyingPrice, latestPrice, quality}, i) => ({
      key: i, cells: [symbol, companyName, buyingPrice, latestPrice, quality],
    });

    return <React.Fragment>
      <NavBar/>
      <Container>
        {pOptions && pOptions.length > 0 ? <Segment className={'portfolio'}>
          <Dropdown
            placeholder='Select a portfolio' fluid selection options={pOptions}
            onChange={this.handleChangePortfolio} defaultValue={`${pID}:${pName}`}/>
          <Container>
            <br/>
            <Header as='h2' color={'teal'} textAlign={'center'}>{pName}</Header>
            <Divider hidden/>
            {showNoStockMsg ?
             <Container textAlign={'center'}><Header disabled as='h3'>It seems you don't have any stocks. Add one below to begin.</Header><br/></Container> :
              <React.Fragment>
                {pID && pData && pData.length > 0 ?
                  <Table color={'teal'} celled headerRow={headerRow} renderBodyRow={renderBodyRow} tableData={pData}/> :
                  <Loader active inline='centered'/>} </React.Fragment>}
            <AddStockModal pID={pID} pName={pName}/>
            <Button color={'red'}>Remove Stock</Button>
          </Container>
        </Segment> : <Segment className={'portfolio'}>
          <Container textAlign={'center'}>
            <Header disabled as='h2'>It seems you don't have any portfolios</Header>
            <Header disabled as='h2'>Add one below to begin</Header>
            <br/>
            <AddPortfolioModal/>
          </Container>
        </Segment>}
      </Container>
    </React.Fragment>
  }
}
