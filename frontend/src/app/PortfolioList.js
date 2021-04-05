import React, {Component} from "react";
import {Segment, Header, Table, Container, Divider, Grid} from "semantic-ui-react";
import NavBar from "./NavBar";
import AddPortfolioModal from "./AddPortfolioModal";
import EditPortfolioModal from "./EditPortfolioModal";
import RemovePortfolioModal from "./RemovePortfolioModal";
import axios from "axios";
import {AXIOS_HEADER, BACKEND_URL} from "../defaults";

export default class PortfolioList extends Component {
  state = {
    portfolioList: [],
    openEditModal: false,
    selectedPortfolio: {},
    portfoliosToRemove: [],
  };

  componentDidMount() {
    const token = localStorage.getItem("token");
    if (token) {
      axios({
        headers: AXIOS_HEADER(token),
        method: 'get', url: `${BACKEND_URL}/stocks/getPortfolios/`
      }).then(({data}) => {
        this.setState({portfolioList: data})
      }).catch(({error}) => {
        alert(error)
      })
    }
  }

  handleEditPortfolio = (i) => {
    // open modal
    const {portfolioList} = this.state;
    if (portfolioList[i]) {
      this.setState({
        openEditModal: true,
        selectedPortfolio: portfolioList[i]
      })
    } else {
      alert('Something went wrong')
    }
  };
  handleClose = () => this.setState({openEditModal: false});

  render() {
    const {portfolioList, selectedPortfolio, openEditModal} = this.state;
    // These are sample headers for the table. We can change this depending on the data we get from the backend
    const headerRow = ['Name', 'Type', 'Description'];

    return <React.Fragment>
      <NavBar/>
      <Container>
        <Segment className={'portfolio'}>
          {openEditModal ?
            <EditPortfolioModal open={openEditModal} onClose={this.handleClose} selected={selectedPortfolio}/> : null}
          <Container>
            <Header as='h2' color={'teal'} textAlign={'center'}>Portfolios</Header>
            <Divider hidden/>
            {portfolioList && portfolioList.length > 0 ? <Grid>
              <Grid.Row>
                <Table color={'teal'} selectable>
                  <Table.Header>
                    <Table.Row>
                      {headerRow.map((header, i) =>
                        <Table.HeaderCell key={i}>{header}</Table.HeaderCell>)}
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    {portfolioList.map(({name, ptype, desc}, i) =>
                      <Table.Row key={i} onClick={() => this.handleEditPortfolio(i)}>
                        <Table.Cell>{name}</Table.Cell>
                        <Table.Cell>{ptype}</Table.Cell>
                        <Table.Cell>{desc}</Table.Cell>
                      </Table.Row>)}
                  </Table.Body>
                </Table>
              </Grid.Row>
              <Grid.Row>
                <AddPortfolioModal/>
                <RemovePortfolioModal portfolioList={portfolioList}/>
              </Grid.Row>
            </Grid> : <Container textAlign={'center'}>
              <Header disabled as='h2'>It seems you don't have any portfolios</Header>
              <Header disabled as='h2'>Add one below to begin</Header>
              <br/>
              <AddPortfolioModal/>
            </Container>}
          </Container>
        </Segment>
      </Container>
    </React.Fragment>
  }
}
