import React from 'react';
import { Route, Switch } from 'react-router-dom';
// Components
import Auth from '../components/Auth';
// Style
import s from './App.module.css';

const App: React.FC = () => (
  <div className={s.App}>
    <Switch>
      <Route exact path="/" render={() => <h1>X-CHECK-APP</h1>} />
      <Route path="/auth" component={Auth} />
      <Route path="/start" render={() => <h1>PAGE NOT FOUND</h1>} />
    </Switch>
  </div>
);

export default App;
