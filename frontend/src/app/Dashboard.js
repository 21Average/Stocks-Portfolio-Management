import React, {Component} from "react";
import {Segment, Header, Dropdown, Container, Divider, Grid, Loader} from "semantic-ui-react";
import NavBar from "./NavBar";
import axios from "axios";
import {AXIOS_HEADER, BACKEND_URL} from "../defaults";
import AddPortfolioModal from "./AddPortfolioModal";
import AddStockModal from "./AddStockModal";
import PortfolioTable from "./PortfolioTable";

export default class Dashboard extends Component {
  state = {
  };

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
