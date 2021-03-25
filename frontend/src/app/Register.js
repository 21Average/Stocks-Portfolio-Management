import React, {Component} from "react";
import {Segment, Header, Form, Container, Divider, Message} from "semantic-ui-react";
import {Link} from "react-router-dom";
import axios from "axios";
import {BACKEND_URL} from "../defaults";
import history from "../history";

export default class Register extends Component {
  state = {
    email: '',
    firstName: '',
    lastName: '',
    password1: '',
    password2: '',
    showErrorMsg: false,
    errorMsg: ''
  };

  handleChange = (e, {name, value}) => {
    this.setState({[name]: value});
  };

  handleClick = () => {
    const {email, firstName, lastName, password1, password2} = this.state;
    if (password1 === password2) {
      if (password1.length >= 8) {
        axios({
          method: 'post', url: `${BACKEND_URL}/register/`,
          data: {'first_name': firstName, 'last_name': lastName, 'email': email, 'password': password1}
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
        name: 'firstName',
        label: 'First name',
        placeholder: 'Enter your first name',
      },
      {
        name: 'lastName',
        label: 'Last name',
        placeholder: 'Enter your last name',
      },
      {
        name: 'email',
        icon: 'mail',
        placeholder: 'Enter your email',
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
        <Form.Group widths='equal'>
          {formContent.map(({name, label, value, placeholder}, i) =>
            i < 2 ? <Form.Input
              key={i} placeholder={placeholder} name={name} value={value} label={label}
              onChange={this.handleChange}/> : null)}
        </Form.Group>
        {formContent.map(({name, value, icon, placeholder, type}, i) =>
          i > 1 ? <Form.Input
            key={i} placeholder={placeholder} name={name} value={value} icon={icon} iconPosition={'left'}
            type={type ? type : ''} fluid required onChange={this.handleChange}/> : null)}
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
