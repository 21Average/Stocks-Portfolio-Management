import React, {Component} from "react";
import {Router, Switch, Route, Redirect} from "react-router-dom";
import './App.css';
import Login from './app/Login';
import Register from './app/Register';
import Navbar from './app/NavBar';
import Home from "./app/Home";
import history from "./history";

export const PrivateRoute = ({component: Component, ...rest}) => {
  return <Route
    {...rest}
    render={props => {
      let isAuthenticated = false; // need to change to actual login function
      return isAuthenticated ? <Component {...props}/> : <Redirect
        to={{
          pathname: '/login',
          state: {
            from: props.location
          }
        }}/>

    }}
  />
};

export default class App extends Component {
  render() {
    return <Router history={history}>
      <div className={"page-content"}>
        <div className={"header-nav-bar"}>
          <Navbar/>
        </div>
        <br/>
        <div className={"scrollable-content"}>
          <Switch>
            {/*<PrivateRoute exact path={'/'} component={Home}/>*/}
            <Route exact path={'/home'} component={Home}/>
            <Route exact path={'/register'} component={Register}/>
            <Route exact path={'/login'} component={Login}/>
          </Switch>
        </div>
      </div>
    </Router>
  }
}
