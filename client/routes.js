import React from 'react';
import { Router, Route, Switch } from 'react-router-dom';
import createBrowserHistory from 'history/createBrowserHistory';

// route components
import App from '../imports/ui/App.js';
import Adm from '../imports/ui/Adm.js';

const browserHistory = createBrowserHistory();

export const renderRoutes = () => (
  <Router history={browserHistory}>
    <Switch>
      <Route path="/admin123" component={Adm}/>
      <Route path="/" component={App}/>
    </Switch>
  </Router>
);
