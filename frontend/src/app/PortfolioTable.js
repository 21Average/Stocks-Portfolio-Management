import React, {Component} from "react";
import {Container, Grid, Table} from "semantic-ui-react";
import {Link} from "react-router-dom";
import AddStockModal from "./AddStockModal";
import RemoveStockModal from "./RemoveStockModal";
import UpdateStockModal from "./UpdateStockModal";

export default class PortfolioTable extends Component {
  state = {
    isLoading: false,
    pData: [],
    stockList: [],
  };

  componentDidMount() {
    const {pData} = this.props;
    let stockList = [];
    pData.forEach(({id, symbol, profit}) => stockList.push({"id": id, "name": symbol, "profit": profit}));
    this.setState({stockList, pData})
  }

  numberWithComma = (x) => {
    return x ? x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : ''
  };

  render() {
    const {pID, pName, pType} = this.props;
    const {stockList, pData} = this.state;
    const transactionHeaderRow = ['Symbol', 'Company', 'Latest Price', 'Buying Price', 'Quantity', 'Profit/Loss ($)', ''];
    const watchlistHeaderRow = ['Symbol', 'Company', 'Latest Price', 'Previous Close', 'Change', 'Return YTD', 'PE Ratio', '52 Week Low', '52 Week High'];

    let headerRow = pType === 'Transaction' ? transactionHeaderRow : watchlistHeaderRow;
    let bodyRow = pType === 'Transaction' ? pData.map(({id, symbol, companyName, latestPrice, quality, buyingPrice, profit}, i) => {
      let profitColour = profit >= 0 ? (profit > 0 ? 'green' : '') : 'red';
      return <Table.Row key={i}>
        <Table.Cell>{symbol}</Table.Cell>
        <Table.Cell>
          <Link to={{pathname: `/stock/${id}`, state: {pType: pType, name: companyName}}}>{companyName}</Link>
        </Table.Cell>
        <Table.Cell>${latestPrice ? this.numberWithComma(latestPrice.toFixed(2)) : '-'}</Table.Cell>
        <Table.Cell>${buyingPrice ? this.numberWithComma(buyingPrice.toFixed(2)) : '-'}</Table.Cell>
        <Table.Cell>{quality ? this.numberWithComma(quality): '-'}</Table.Cell>
        <Table.Cell><p style={{color: profitColour}}>{profit > 0 ? '+' : ''}{this.numberWithComma(profit.toFixed(2))}</p></Table.Cell>
        <Table.Cell collapsing><UpdateStockModal stock={pData[i]} pID={pID}/></Table.Cell>
      </Table.Row>
    }) : pData.map(({symbol, companyName, latestPrice, previousClose, changePercent, marketCap, ytdChange, peRatio, week52Low, week52High}, i) => {
      let percent = (changePercent * 100).toFixed(2);
      let percentSymbol = percent > 0 ? '+' : '';
      let percentColour = percent >= 0 ? (percent > 0 ? 'green' : '') : 'red';
      return <Table.Row key={i}>
        <Table.Cell>{symbol}</Table.Cell>
        <Table.Cell>
          <Link to={{pathname: `/stock/${symbol}`, state: {pType: pType}}}>{companyName}</Link>
        </Table.Cell>
        <Table.Cell>${latestPrice ? this.numberWithComma(latestPrice.toFixed(2)) : '-'}</Table.Cell>
        <Table.Cell>${previousClose ? this.numberWithComma(previousClose.toFixed(2)) : '-'}</Table.Cell>
        <Table.Cell>{changePercent ? <p style={{color: percentColour}}>{percentSymbol}{percent}%</p> : '-'}</Table.Cell>
        <Table.Cell>{ytdChange ? (ytdChange * 100).toFixed(2) : '-'}%</Table.Cell>
        <Table.Cell>{peRatio ? peRatio : '-'}</Table.Cell>
        <Table.Cell>${week52Low ? this.numberWithComma(week52Low.toFixed(2)) : '-'}</Table.Cell>
        <Table.Cell>${week52High ? this.numberWithComma(week52High.toFixed(2)) : '-'}</Table.Cell>
      </Table.Row>
    });

    return <Container>
      <Grid textAlign={'center'}>
        <Grid.Row>
          <Table color={'teal'} striped>
            <Table.Header><Table.Row>{headerRow.map((header, i) =>
              <Table.HeaderCell key={i}>{header}</Table.HeaderCell>)}</Table.Row></Table.Header>
            <Table.Body>{bodyRow}</Table.Body>
          </Table>
        </Grid.Row>
        <Grid.Row>
          <AddStockModal pID={pID} pName={pName} pType={pType}/>
          {stockList && <RemoveStockModal pID={pID} stockList={stockList}/>}
        </Grid.Row>
      </Grid>
    </Container>
  }
}