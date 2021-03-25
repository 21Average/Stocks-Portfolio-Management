import React, {Component} from "react";
import {Segment, Container, Divider, Button, Header, Form, Table, Grid, Modal, Message} from "semantic-ui-react";
import history from "../history";
import NavBar from "./NavBar";
import axios from "axios";
import {BACKEND_URL, AXIOS_HEADER} from "../defaults";

export default class Settings extends Component {
  state = {
    firstName: '',
    lastName: '',
    email: '',
    interests: '',
    showSuccessMsg: false,
    showBadPasswordMsg: false,
    selectedAlert: {},
    alertData: [],
    openAlertModal: false,
  };

  componentDidMount() {
    const token = localStorage.getItem("token");
    if (token) {
      // get user information
      axios({
        headers: AXIOS_HEADER(token),
        method: 'get', url: `${BACKEND_URL}/profile/`,
      }).then(({data}) => {
        const {first_name, last_name, email, interests} = data;
        this.setState({firstName: first_name, lastName: last_name, email, interests});
      }).catch(({error}) => {
        alert(error)
      })
    }
  }

  handleChange = (e, {name, value}) => {
    let newValue = name === 'interests' ? value.split(',') : value;
    this.setState({[name]: newValue});
  };

  handleSubmit = () => {
    const {firstName, lastName, email, interests, password} = this.state;
    let userInfo = {first_name: firstName, last_name: lastName, email: email, interests: interests};
    if (password !== undefined) {
      if (password.length < 8) {
        this.setState({showBadPasswordMsg: true});
        return
      }
      userInfo['password'] = password
    }
    // send to backend
    const token = localStorage.getItem("token");
    if (token) {
      axios({
        headers: AXIOS_HEADER(token),
        method: 'patch', url: `${BACKEND_URL}/profile/`,
        data: userInfo
      }).then(() => {
        this.setState({showSuccessMsg: true});
        this.setState({showBadPasswordMsg: false});
      }).catch(({errors}) => {
        console.log(errors);
        alert("Something went wrong")
      });
    }
  };

  handleDismissSuccess = () => {
    this.setState({showSuccessMsg: false});
  };
  handleDismissBadPw = () => {
    this.setState({showBadPasswordMsg: false});
  };

  editAlert = (i) => {
    const {alertData} = this.state;
    if (alertData[i]) {
      this.setState({openAlertModal: true, selectedAlert: alertData[i]})
    }
  };

  handleCloseModal = () => {
    this.setState({openAlertModal: false});
  };

  render() {
    const {firstName, lastName, email, interests, showSuccessMsg, showBadPasswordMsg, alertData, openAlertModal, selectedAlert} = this.state;
    // These are sample headers for the table. We can change this depending on the data we get from the backend
    const headerRow = ['Stock', 'Price'];

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
              }}/>
            </Grid.Column>
          </Grid>

          <Form onSubmit={this.handleSubmit}>
            <Form.Group widths={'equal'}>
              <Form.Input label={'First name'} name={'firstName'} defaultValue={firstName}
                          onChange={this.handleChange}/>
              <Form.Input label={'Last name'} name={'lastName'} defaultValue={lastName} onChange={this.handleChange}/>
            </Form.Group>
            <Form.Group widths={'equal'}>
              <Form.Input label={'Email'} name={'email'} defaultValue={email} onChange={this.handleChange}/>
              <Form.Input label={'Password'} name={'password'} type={'password'} onChange={this.handleChange}/>
            </Form.Group>
            {showBadPasswordMsg ?
              <Message negative onDismiss={this.handleDismissBadPw}>Password must have at least 8
                characters</Message> : null}
            <Form.Input label={'Interests'} name={'interests'} defaultValue={interests ? interests : ''}
                        placeholder={'Enter your interests separated by a comma'} onChange={this.handleChange}/>
            {showSuccessMsg ?
              <Message positive onDismiss={this.handleDismissSuccess}>Profile updated successfully!</Message> : null}
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