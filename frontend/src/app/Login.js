import React, {Component} from "react";
import {Segment, Button, Header, Form, Container, Divider} from "semantic-ui-react";
import {Link} from 'react-router-dom';
import history from "../history";

export default class Login extends Component {

  render() {
    return <Segment className={'auth-container'}>
      <Header as='h1' color={'teal'} textAlign={'center'}>
        Stock Overflow
        <Header.Subheader>Login</Header.Subheader>
      </Header>
      <Divider/>
      <Form>
        <Form.Input fluid icon='mail' iconPosition='left' placeholder='Enter your email address'/>
        <Form.Input fluid icon='lock' iconPosition='left' placeholder='Enter your password' type='password'/>
        <Container textAlign={'right'}>
          <a style={{'color': 'gray'}} href={"/"}>Forgot your password?</a>
        </Container>
        <br/>
        <Button color='teal' fluid size='large' onClick={() => {history.push("/")}}>
          Login
        </Button>
      </Form>
      <Divider hidden/>
      <Container textAlign={'center'}>
        Not registered? <Link to={"/register"}>Sign up here</Link>
      </Container>
    </Segment>
  }
}
