import * as H from 'history';
import * as React from "react";
import { Route, Switch, withRouter } from "react-router-dom";

import Home from './Home';
import Makes from './Makes';
import Models from './Models';
import NoMatch from './NoMatch';
import Types from './Types';

const navigateTo = (location: string, history: H.History<any>) => () => {
  if (history.location.pathname !== location) {
    history.push(location);
  }
};

const AppRouter = withRouter(({ history }) => (
  <>
    <nav className="bp3-navbar bp3-dark">
      <div style={{
        margin: '0 auto',
        width: '480px',
      }}>
        <div className="bp3-navbar-group bp3-align-left">
          <div className="bp3-navbar-heading">Asset Manager</div>
        </div>
        <div className="bp3-navbar-group bp3-align-right">
          <button onClick={navigateTo('/', history)} className="bp3-button bp3-minimal bp3-icon-home">Home</button>
          <button onClick={navigateTo('/types', history)} className="bp3-button bp3-minimal bp3-icon-document">Types</button>
          <button onClick={navigateTo('/makes', history)} className="bp3-button bp3-minimal bp3-icon-document">Makes</button>
          <button onClick={navigateTo('/models', history)} className="bp3-button bp3-minimal bp3-icon-document">Models</button>
        </div>
      </div>
    </nav>
    <Switch>
      <Route exact={true} path="/" component={Home} />
      <Route path="/types" component={Types} />
      <Route path="/makes" component={Makes} />
      <Route path="/models" component={Models} />
      <Route component={NoMatch} />
    </Switch>
  </>
));

export default AppRouter;
