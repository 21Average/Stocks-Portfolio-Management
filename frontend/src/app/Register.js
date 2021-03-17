import React, {Component} from "react";
import {Segment, Header, Form, Container, Divider, Message} from "semantic-ui-react";
import {Link} from "react-router-dom";
import axios from "axios";
import {BACKEND_URL} from "../defaults";
import history from "../history";

export default class Register extends Component {
  state = {
    username: '',
    password1: '',
    password2: '',
    showErrorMsg: false,
    errorMsg: ''
  };

  handleChange = (e, {name, value}) => {
    this.setState({[name]: value});
  };


  handleClick = () => {
    const {username, password1, password2} = this.state;
    if (password1 === password2) {
      if (password1.length >= 8) {
        axios({
          method: 'post', url: `${BACKEND_URL}/register/`,
          data: {'username': username, 'password': password1}
        }).then(({data}) => {
          localStorage.setItem("token", data.token);
          history.push('/home')
        }).catch(() => {
          this.setState({errorMsg: 'Account already exists', showErrorMsg: true});
        });
      } else {
        this.setState({errorMsg: 'Password must have at least 8 characters', showErrorMsg: true})
      }
    } else {
      this.setState({errorMsg: 'Passwords do not match', showErrorMsg: true})
    }
  };

  render() {
    const {showErrorMsg, errorMsg} = this.state;

    let formContent = [
      {
        name: 'username',
        icon: 'user',
        placeholder: 'Enter a username',
      },
      {
        name: 'password1',
        icon: 'lock',
        placeholder: 'Enter your password',
        type: 'password',
      },
      {
        name: 'password2',
        icon: 'lock',
        placeholder: 'Re-type your password',
        type: 'password',
      }
    ];

    return <Segment className={'auth-container'}>
      <Header as='h1' color={'teal'} textAlign={'center'}>
        Welcome to Stock Overflow
        <Header.Subheader>Register</Header.Subheader>
      </Header>
      <Divider/>
      <Form onSubmit={this.handleSubmit}>
        {formContent.map(({name, value, icon, placeholder, type}, i) =>
          <Form.Input
            key={i}
            placeholder={placeholder}
            name={name}
            value={value}
            icon={icon}
            iconPosition='left'
            type={type ? type : ''}
            fluid
            required
            onChange={this.handleChange}/>
        )}
        {showErrorMsg ? <Message negative>{errorMsg}</Message> : null}
        <Form.Button color='teal' fluid size='large' onClick={() => {
          this.setState({showErrorMsg: false});
          this.handleClick()
        }}>Register</Form.Button>
      </Form>
      <Divider hidden/>
      <Container textAlign={'center'}>
        Already have an account? <Link to="/login">Log in</Link>
      </Container>
    </Segment>
  }
}
