import React, {Component} from "react";
import {Menu} from "semantic-ui-react";
import {NavLink} from "react-router-dom";
import history from "../history";

export default class NavBar extends Component {

  render() {
    const items = [
      {name: 'Dashboard', to: '/dashboard'},
      {name: 'Portfolio', to: '/portfolio'},
      {name: 'Settings', to: '/settings'},
    ];

    return <Menu inverted size={'large'}>
      <Menu.Menu position={'right'}>
        {items.map(({name, to}, i) =>
          <Menu.Item name={name} as={NavLink} to={to} key={i} selected={history.location.pathname === to}/>)}
      </Menu.Menu>
    </Menu>
  }
}