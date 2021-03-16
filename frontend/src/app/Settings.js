import React, {Component} from "react";
import {Segment, Container, Divider, Button, Header, Form, Table, Grid, Modal} from "semantic-ui-react";
import history from "../history";
import NavBar from "./NavBar";

export default class Settings extends Component {
  state = {
    selectedAlert: {},
    alertData: [],
    openAlertModal: false,
  };

  editAlert = (i) => {
    const {alertData} = this.state;
    if (alertData[i]) {
      this.setState({openAlertModal: true, selectedAlert: alertData[i]})
    }
  };

  handleSubmit = () => {
    // save portfolio edits here
    console.log("alert edited")
  };

  handleCloseModal = () => {
    this.setState({openAlertModal: false});
  };

  render() {
    // These are sample headers for the table. We can change this depending on the data we get from the backend
    const headerRow = ['Stock', 'Price'];
    // Sample data - get this data from backend
    const {alertData, openAlertModal, selectedAlert} = this.state;

    return <React.Fragment>
      <NavBar/>
      <Container>
        {openAlertModal ? <Modal
          onClose={() => this.setState({openPortfolioModal: false})}
          onOpen={() => this.setState({openPortfolioModal: true})}
          open={openAlertModal} size={'small'}>
          <Header as={'h1'}>Edit alert for "{selectedAlert['name']}"</Header>
          <Modal.Content>
            <Form>
              <Form.Input label={'Stock name'}/>
              <Form.Input label={'Price'}/>
            </Form>
          </Modal.Content>
          <Modal.Actions>
            <Button onClick={this.handleSubmit} positive>Save</Button>
            <Button onClick={this.handleCloseModal}>Cancel</Button>
          </Modal.Actions>
        </Modal> : null}
        <Segment className={'portfolio'}>
          <Grid columns={2}>
            <Grid.Column>
              <Header as={'h1'}>Profile</Header>
            </Grid.Column>
            <Grid.Column align={'right'}>
              <Button size='large' icon={'chevron right'} labelPosition={'right'} content={'Logout'} onClick={() => {
                localStorage.clear();
                history.push('/login');
                window.location.reload();
              }}/>
            </Grid.Column>
          </Grid>
          <Form onSubmit={this.handleSubmit}>
            <Form.Group widths={'equal'}>
              <Form.Input label={'Name'}/>
              <Form.Input label={'Interests'}/>
            </Form.Group>
            <Form.Group widths={'equal'}>
              <Form.Input label={'Email'}/>
              <Form.Input label={'Password'} type={'password'}/>
            </Form.Group>
            <Form.Button color='green' size='large' onClick={this.handleClick}>Save changes</Form.Button>
          </Form>
        </Segment>
        <Divider hidden/>
        <Segment className={'portfolio'}>
          <Header as={'h1'}>Alerts</Header>
          <Table color={'teal'} selectable>
            <Table.Header>
              <Table.Row>
                {headerRow.map((header, i) =>
                  <Table.HeaderCell key={i}>{header}</Table.HeaderCell>
                )}
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {alertData.map(({name, price}, i) =>
                <Table.Row key={i} onClick={() => this.editAlert(i)}>
                  <Table.Cell>{name}</Table.Cell>
                  <Table.Cell>{price}</Table.Cell>
                </Table.Row>)}
            </Table.Body>
          </Table>
          <Button color={'green'}>Add Alert</Button>
          <Button color={'red'}>Remove Alert</Button>
        </Segment>
      </Container>
    </React.Fragment>
  }
}