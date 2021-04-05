import React, {Component} from "react";
import {Segment, Container, Header, Divider} from "semantic-ui-react";
import NavBar from "./NavBar";
import Chart from "./Chart";

export default class News extends Component {
  render() {

    return <React.Fragment>
      <NavBar/>
      <Container>
        <Segment className={'portfolio'}>
          <Header as={'h1'}>News</Header>
          <Divider section/>
          <Chart/>
        </Segment>
      </Container>
    </React.Fragment>
  }
}