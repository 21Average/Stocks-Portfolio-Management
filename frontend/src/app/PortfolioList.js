import React, {Component} from "react";
import {Segment, Header, Table, Button, Container, Divider, Modal, Grid, Form} from "semantic-ui-react";
import NavBar from "./NavBar";

export default class PortfolioList extends Component {
  state = {
    portfolioList: [],
    openEditPortfolioModal: false,
    openCreatePortfolioModal: false,
    openRemovePortfolioModal: false,
    selectedPortfolio: {},
    portfolioNameValue: '',
    portfolioTypeValue: '',
    portfoliosToRemove: [],
  };

  handleSubmitPortfolio = () => {
    const {portfolioNameValue, portfolioTypeValue} = this.state;
    let newPortfolio = {
      key: portfolioNameValue + portfolioTypeValue, // need to change to something unique
      name: portfolioNameValue,
      type: portfolioTypeValue,
      created: new Date().toLocaleDateString()
    };
    this.setState({openCreatePortfolioModal: false, portfolioList: [...this.state.portfolioList, newPortfolio]});
  };

  handlePortNameChange = (e, {value}) => {
    this.setState({portfolioNameValue: value});
  };
  handlePortTypeChange = (e, {value}) => {
    this.setState({portfolioTypeValue: value});
  };
  handleCheckBoxChange = (e, {value}) => {
    const {portfoliosToRemove} = this.state;
    let i = portfoliosToRemove.indexOf(value);
    if (i === -1) {
      this.setState({portfoliosToRemove: [...portfoliosToRemove, value]})
    } else {
      portfoliosToRemove.splice(i, 1)
    }
  };

  handleCloseModal = (modalType) => {
    if (modalType === 'add') {
      this.setState({openCreatePortfolioModal: false})
    } else if (modalType === 'edit') {
      this.setState({openEditPortfolioModal: false})
    } else {
      this.setState({openRemovePortfolioModal: false})
    }
  };

  handleEditPortfolio = (i) => {
    // open modal
    const {portfolioList} = this.state;
    if (portfolioList[i]) {
      this.setState({
        openEditPortfolioModal: true,
        selectedPortfolio: portfolioList[i]
      })
    } else {
      alert('Something went wrong')
    }
  };

  handleRemovePortfolio = () => {
    const {portfoliosToRemove} = this.state;
    this.setState({openRemovePortfolioModal: false, portfoliosToRemove})
  };

  render() {
    const {portfolioList, openEditPortfolioModal, selectedPortfolio, openCreatePortfolioModal, openRemovePortfolioModal, portfolioTypeValue} = this.state;
    // These are sample headers for the table. We can change this depending on the data we get from the backend
    const headerRow = ['Name', 'Type', 'Created'];
    const portfolioTypes = [{name: 'Transaction'}, {name: 'Watchlist'}];

    return <React.Fragment>
      <NavBar/>
      <Container>
        <Segment className={'portfolio'}>
          {openEditPortfolioModal ?
            <Modal
              open={openEditPortfolioModal}>
              <Header as={'h1'}>Edit "{selectedPortfolio['name']}"</Header>
              <Modal.Content>
                <Form onSubmit={this.handleSubmit}>
                  <Form.Input label={'Name'}/>
                </Form>
              </Modal.Content>
              <Modal.Actions>
                <Button onClick={this.handleSubmit} positive>Save</Button>
                <Button onClick={() => this.handleCloseModal('edit')}>Cancel</Button>
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
                    {portfolioList.map(({name, type, created, modified, change}, i) =>
                      <Table.Row key={i} onClick={() => this.handleEditPortfolio(i)}>
                        <Table.Cell>{name}</Table.Cell>
                        <Table.Cell>{type}</Table.Cell>
                        <Table.Cell>{created}</Table.Cell>
                      </Table.Row>)}
                  </Table.Body>
                </Table>
              </Grid.Row>
              <Grid.Row>
                <Modal
                  onOpen={() => this.setState({openCreatePortfolioModal: true})}
                  open={openCreatePortfolioModal}
                  trigger={<Button color={'green'}>Add Portfolio</Button>}>
                  <Modal.Header>Add new portfolio</Modal.Header>
                  <Modal.Content>
                    <Form>
                      <Form.Input label={'Portfolio name'} onChange={this.handlePortNameChange}/>
                      <Form.Group inline>
                        <label>Type</label>
                        {portfolioTypes.map(({name}, i) =>
                          <Form.Radio
                            key={i}
                            label={name}
                            value={name}
                            checked={portfolioTypeValue === name}
                            onChange={this.handlePortTypeChange}/>
                        )}
                      </Form.Group>
                    </Form>
                  </Modal.Content>
                  <Modal.Actions>
                    <Button onClick={this.handleSubmitPortfolio} positive>Add</Button>
                    <Button onClick={() => this.handleCloseModal('add')}>Cancel</Button>
                  </Modal.Actions>
                </Modal>
                <Modal
                  onOpen={() => this.setState({openRemovePortfolioModal: true})}
                  open={openRemovePortfolioModal}
                  trigger={<Button color={'red'}>Remove Portfolio</Button>}>
                  <Modal.Header>Remove portfolio</Modal.Header>
                  <Modal.Content>
                    <Form>
                      {portfolioList && portfolioList.length > 0 ? <Form.Group>
                        {portfolioList.map(({name}, i) =>
                          <Form.Checkbox key={i} value={name} label={name} onChange={this.handleCheckBoxChange}/>)}
                      </Form.Group> : <Header disabled>No portfolios to delete</Header>}
                    </Form>
                  </Modal.Content>
                  <Modal.Actions>
                    <Button onClick={this.handleRemovePortfolio} negative>Remove</Button>
                    <Button onClick={() => this.handleCloseModal('delete')}>Cancel</Button>
                  </Modal.Actions>
                </Modal>
              </Grid.Row>
            </Grid>
          </Container>
        </Segment>
      </Container>
    </React.Fragment>
  }
}
