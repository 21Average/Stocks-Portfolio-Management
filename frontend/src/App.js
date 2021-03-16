import React, {Component} from "react";
import {Router, Switch, Route, Redirect} from "react-router-dom";
import './App.css';
import Login from './app/Login';
import Register from './app/Register';
import Home from "./app/Home";
import PortfolioList from "./app/PortfolioList";
import Recommendations from "./app/Recommendations";
import News from "./app/News";
import Settings from "./app/Settings";
import history from "./history";

export const PrivateRoute = ({component: Component, ...rest}) => {
  return <Route
    {...rest}
    render={props => {
      const loggedInUser = localStorage.getItem("token");
      return loggedInUser ? <Component {...props}/> : (<Redirect to={{
        pathname: '/login',
        state: {from: props.location}
      }}/>)
    }}
  />
};

export default class App extends Component {
  render() {
    const routes = [
      {
        path: '/home', component: Home
      }, {
        path: '/portfolios', component: PortfolioList
      }, {
        path: '/recommendations', component: Recommendations
      }, {
        path: '/news', component: News
      }, {
        path: '/settings', component: Settings
      }, {
        path: '/register', component: Register
      }, {
        path: '/login', component: Login
      },
    ];

    return <Router history={history}>
      <div className={"page-content"}>
        <Switch>
          <PrivateRoute exact path={'/home'} component={Home}/>
          {routes.map(({path, component}, i) =>
            <Route key={i} exact path={path} component={component}/>
          )}
          <Route exact path={'/'}><Redirect to={'/home'}/></Route>
        </Switch>
      </div>
    </Router>
  }
}
