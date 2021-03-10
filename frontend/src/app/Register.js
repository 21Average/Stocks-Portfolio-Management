import React, {Component} from "react";
import {Segment, Button, Header, Form, Container, Divider} from "semantic-ui-react";
import {Link} from 'react-router-dom';

export default class Register extends Component {
  render() {
    let formContent = [
      {
        'icon': 'user',
        'placeholder': 'Enter your name',
      },
      {
        'icon': 'mail',
        'placeholder': 'Enter your email',
      }, {
        'icon': 'lock',
        'placeholder': 'Enter your password',
        'type': 'password'
      },
      {
        'icon': 'lock',
        'placeholder': 'Re-type your password',
        'type': 'password'
      }
    ];

    return <Segment className={'auth-container'}>
      <Header as='h1' color={'teal'} textAlign={'center'}>
        Welcome to Stock Overflow
        <Header.Subheader>Register</Header.Subheader>
      </Header>
      <Divider/>
      <Form>
        {formContent.map(({icon, placeholder, type}, i) =>
          <Form.Input key={i} fluid icon={icon} iconPosition='left' placeholder={placeholder} type={type ? type: ''}/>
        )}
        <Button color='teal' fluid size='large'>Register</Button>
      </Form>
      <Divider hidden/>
      <Container textAlign={'center'}>
        Already have an account? <Link to="/login">Log in</Link>
      </Container>
    </Segment>
  }
}
