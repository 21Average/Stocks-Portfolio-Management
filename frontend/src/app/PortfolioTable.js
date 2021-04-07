import React, {Component} from "react";
import {Button, Container, Grid, Table} from "semantic-ui-react";
import AddStockModal from "./AddStockModal";

export default class Settings extends Component {
  state = {
    isLoading: false,
  };

  render() {
    const {pData, pID, pName, pType} = this.props;
    const transactionHeaderRow = ['Symbol', 'Company', 'Buying Price', 'Latest Price', 'Quantity']; // 'Industry'];
    const renderTransactionBodyRow = ({symbol, companyName, buyingPrice, latestPrice, quality}, i) => ({
      key: i, cells: [symbol, companyName, buyingPrice, latestPrice, quality],
    });

    const watchlistHeaderRow = ['Symbol', 'Company', 'Latest Price', 'Previous Close', 'Market Cap', 'Return YTD', 'PE Ratio', '52Wk Low', '52Wk High'];
    const renderWatchlistBodyRow = ({symbol, companyName, latestPrice, previousClose, marketCap, ytdChange, peRatio, week52High, week52Low}, i) => ({
      key: i,
      cells: [symbol, companyName, latestPrice, previousClose, marketCap, ytdChange, peRatio, week52High, week52Low],
    });

    return <Container>
      {/*<Loader active inline='centered'/>*/}
      <Grid textAlign={'center'}>
        <Grid.Row>
          <Table
            color={'teal'} celled tableData={pData}
            headerRow={pType === 'Transaction' ? transactionHeaderRow : watchlistHeaderRow}
            renderBodyRow={pType === 'Transaction' ? renderTransactionBodyRow : renderWatchlistBodyRow}/>
        </Grid.Row>
        <Grid.Row>
          <AddStockModal pID={pID} pName={pName} pType={pType}/>
          <Button color={'red'}>Remove Stock</Button>
        </Grid.Row>
      </Grid>
    </Container>
  }
}