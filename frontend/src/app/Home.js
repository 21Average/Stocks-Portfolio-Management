import React, {Component} from "react";
import {Segment, Header} from "semantic-ui-react";

export default class Login extends Component {

  render() {
    return <Segment className={'auth-container'}>
      <Header as='h1' color={'teal'} textAlign={'center'}>HOMEPAGE</Header>
    </Segment>
  }
}
