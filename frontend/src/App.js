import React, {Component} from "react";
import {Router, Switch, Route, Redirect} from "react-router-dom";
import './App.css';
import Login from './app/Login';
import Register from './app/Register';
import Navbar from './app/NavBar';
import Home from "./app/Home";
import PortfolioList from "./app/PortfolioList";
import Settings from "./app/Settings";
import Recommendations from "./app/Recommendations";
import history from "./history";

export const PrivateRoute = ({component: Component, ...rest}) => {
  return <Route
    {...rest}
    render={props => {
      let isAuthenticated = true; // need to change to actual login function
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
    let isAuthenticated = true;

    return <Router history={history}>
      <div className={"page-content"}>
        {isAuthenticated ? <div className={"header-nav-bar"}>
          <Navbar/>
        </div> : null}
        <br/>
        <div className={"scrollable-content"}>
          <Switch>
            <PrivateRoute exact path={'/home'} component={Home}/>
            <Route exact path={'/recommendations'} component={Recommendations}/>
            <Route exact path={'/settings'} component={Settings}/>
            <Route exact path={'/portfolios'} component={PortfolioList}/>
            <Route exact path={'/register'} component={Register}/>
            <Route exact path={'/login'} component={Login}/>
            <Route exact path={'/'}><Redirect to={'/home'}/></Route>
          </Switch>
        </div>
      </div>
    </Router>
  }
}
