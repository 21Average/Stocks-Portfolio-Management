import React, {Component} from "react";
import {Segment, Button, Header, Form, Container, Divider} from "semantic-ui-react";
import {Link} from 'react-router-dom';
import axios from "axios";
import history from "../history";

export default class Register extends Component {
  state = {
    name: '',
    email: '',
    password1: '',
    password2: ''
  };

  handleChange = (e, {name, value}) => {
    this.setState({[name]: value});
  };

  handleSubmit = () => {
    const {name, email} = this.state;
    this.setState({submittedName: name, submittedEmail: email})
  };

  handleClick = () => {
    const {name, email, password1, password2} = this.state;
    if (password1 === password2) {
      axios({
        method: 'post',
        url: 'http://127.0.0.1:8000/register/',
        data: {'name': name, 'email': email}
      }).then((response) => {
        console.log(response);
        history.push('/home')
      }).catch((response) => {
        console.log(response)
      });
    }
  };

  render() {
    let formContent = [
      {
        name: 'name',
        icon: 'user',
        placeholder: 'Enter your name',
      },
      {
        name: 'email',
        icon: 'mail',
        placeholder: 'Enter your email',
      },
      {
        name: 'password',
        icon: 'lock',
        placeholder: 'Enter your password',
        type: 'password',
      },
      {
        name: 'password_2',
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
            onChange={this.handleChange}/>
        )}
        <Form.Button color='teal' fluid size='large' onClick={this.handleClick}>Register</Form.Button>
      </Form>
      <Divider hidden/>
      <Container textAlign={'center'}>
        Already have an account? <Link to="/login">Log in</Link>
      </Container>
    </Segment>
  }
}
