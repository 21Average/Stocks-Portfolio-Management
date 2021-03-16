import React, {Component} from "react";
import {Segment, Header, Form, Container, Divider, Message} from "semantic-ui-react";
import {Link} from 'react-router-dom';
import history from "../history";
import axios from "axios";
import {BACKEND_URL} from "../defaults";

export default class Login extends Component {
  state = {
    username: '',
    password: '',
    showErrorMsg: false
  };

  handleChange = (e, {name, value}) => {
    this.setState({[name]: value});
  };


  handleClick = () => {
    const {username, password} = this.state;
    axios({
      method: 'post', url: `${BACKEND_URL}/login/`,
      data: {'username': username, 'password': password}
    }).then(({data}) => {
      localStorage.setItem("token", data);
      history.push('/home')
    }).catch(() => {
      this.setState({showErrorMsg: true});
    });
  };

  render() {
    const {showErrorMsg} = this.state;

    return <Segment className={'auth-container'}>
      <Header as='h1' color={'teal'} textAlign={'center'}>
        Stock Overflow
        <Header.Subheader>Login</Header.Subheader>
      </Header>
      <Divider/>
      <Form>
        <Form.Input fluid icon='user' iconPosition='left' name={'username'} placeholder='Enter your username'
                    onChange={this.handleChange}/>
        <Form.Input fluid icon='lock' iconPosition='left' name={'password'} placeholder='Enter your password'
                    type='password' onChange={this.handleChange}/>
        <Container textAlign={'right'}>
          <a style={{'color': 'gray'}} href={"/"}>Forgot your password?</a>
        </Container>
        <br/>
        <Form.Button color='teal' fluid size='large' onClick={this.handleClick}>Login</Form.Button>
      </Form>
      {showErrorMsg ? <Message negative>Incorrect username or password</Message> : null}
      <Divider hidden/>
      <Container textAlign={'center'}>
        Not registered? <Link to={"/register"}>Sign up here</Link>
      </Container>
    </Segment>
  }
}
