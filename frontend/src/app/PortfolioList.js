import React, {Component} from "react";
import {Segment, Header, Table, Button, Container, Divider, Modal, Grid, Form} from "semantic-ui-react";
import NavBar from "./NavBar";

export default class PortfolioList extends Component {
  state = {
    tableData: [],
    openPorfolioModal: false,
    selectedPortfolio: {}
  };

  handleSubmit = () => {
    // save portfolio edits here
    console.log("portfolio edited")
  };

  handleCloseModal = () => {
    this.setState({openPortfolioModal: false});
  };

  editPortfolio = (i) => {
    // open modal
    const {tableData} = this.state;
    if (tableData[i]) {
      this.setState({
        openPortfolioModal: true,
        selectedPortfolio: tableData[i]
      })
    } else {
      alert('Something went wrong')
    }
  };

  render() {
    const {tableData, openPortfolioModal, selectedPortfolio} = this.state;
    // These are sample headers for the table. We can change this depending on the data we get from the backend
    const headerRow = ['Name', 'Type', 'Created', 'Last modified', 'Total change'];
    // Sample data - get this data from backend

    return <React.Fragment>
      <NavBar/>
      <Container>
        <Segment className={'portfolio'}>
          {openPortfolioModal ?
            <Modal
              onClose={() => this.setState({openPortfolioModal: false})}
              onOpen={() => this.setState({openPortfolioModal: true})}
              open={openPortfolioModal}>
              <Header as={'h1'}>Edit "{selectedPortfolio['name']}"</Header>
              <Modal.Content>
                <Form onSubmit={this.handleSubmit}>
                  <Form.Input label={'Name'}/>
                </Form>
              </Modal.Content>
              <Modal.Actions>
                <Button onClick={this.handleSubmit} positive>Save</Button>
                <Button onClick={this.handleCloseModal}>Cancel</Button>
              </Modal.Actions>
            </Modal> : null}
          <Container>
            <Header as='h2' color={'teal'} textAlign={'center'}>Portfolios</Header>
            <Divider hidden/>
            <Grid>
              <Grid.Row>
                <Table color={'teal'} selectable>
                  <Table.Header>
                    <Table.Row>
                      {headerRow.map((header, i) =>
                        <Table.HeaderCell key={i}>{header}</Table.HeaderCell>)}
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    {tableData.map(({name, type, created, modified, change}, i) =>
                      <Table.Row key={i} onClick={() => this.editPortfolio(i)}>
                        <Table.Cell>{name}</Table.Cell>
                        <Table.Cell>{type}</Table.Cell>
                        <Table.Cell>{created}</Table.Cell>
                        <Table.Cell>{modified}</Table.Cell>
                        <Table.Cell>{change}</Table.Cell>
                      </Table.Row>)}
                  </Table.Body>
                </Table>
              </Grid.Row>
              <Grid.Row>
                <Modal
                  trigger={<Button color={'green'}>Add Portfolio</Button>}
                  header='Add new portfolio'
                  content='Need to edit to include form'
                  actions={[{key: 'add', content: 'Add', positive: true}, 'Cancel']}/>
                <Modal
                  trigger={<Button color={'red'}>Remove Portfolio</Button>}
                  header='Remove portfolio'
                  content='Need to edit to include form'
                  actions={[{key: 'remove', content: 'Remove', color: 'red'}, 'Cancel']}/>
              </Grid.Row>
            </Grid>
          </Container>
        </Segment>
      </Container>
    </React.Fragment>
  }
}
