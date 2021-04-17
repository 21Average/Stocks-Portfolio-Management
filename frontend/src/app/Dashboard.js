import React, {Component} from "react";
import {Segment, Container} from "semantic-ui-react";
import NavBar from "./NavBar";

export default class Dashboard extends Component {
  state = {};

  componentDidMount() {
  }


  render() {

    return <React.Fragment>
      <NavBar/>
      <Container>
        <Segment className={'portfolio'}>
          <p>News</p>
          <p>Account summary</p>
        </Segment>
      </Container>
    </React.Fragment>
  }
}
