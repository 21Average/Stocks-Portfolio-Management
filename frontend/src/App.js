import React, {Component} from "react";
import {Router, Switch, Route, Redirect} from "react-router-dom";
import './App.css';
import Login from './app/Login';
import Register from './app/Register';
import Dashboard from "./app/Dashboard";
import Portfolio from "./app/Portfolio";
import PortfolioList from "./app/PortfolioList";
import Stock from "./app/Stock";
import Landing from "./pages/Landing";
import Settings from "./app/Settings";
import history from "./history";
import "style.css";


export const PrivateRoute = ({component: Component, ...rest}) => {
  return <Route
    {...rest}
    render={props => {
      const loggedInUser = localStorage.getItem("token");
      return loggedInUser ? <Component {...props}/> : (
        <Redirect to={{pathname: '/login', state: {from: props.location}}}/>)
    }}
  />
};

export default class App extends Component {
  render() {
    const routes = [
      {
        path: '/dashboard', component: Dashboard
      }, {
        path: '/portfolio/all', component: PortfolioList
      }, {
        path: '/portfolio', component: Portfolio
      }, {
        path: '/stock/:symbol', component: Stock
      },
      {
        path: '/settings', component: Settings
      }, {
        path: '/register', component: Register
      }, {
        path: '/login', component: Login
      }, {
        path: '/', component: Landing
      },
    ];

    return <Router history={history}>
      <div className={"page-content"}>
        <Switch>
          <Route exact path={'/'} component={Landing}/>
          {routes.map(({path, component}, i) =>
            <Route key={i} exact path={path} component={component}/>
          )}
          <Route exact path={'/'}><Redirect to={'/dashboard'}/></Route>
        </Switch>
      </div>
    </Router>
  }
}
