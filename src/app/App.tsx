// React / Redux
import React, { useEffect } from 'react';
import { Route, Switch } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { push } from 'connected-react-router';
// Components
import Auth from '../components/Auth';
// Selectors
import { selectors } from '../reducers/user';
// Style
import s from './App.module.css';

const App: React.FC = () => {
  const userStatus = useSelector(selectors.getStatus);
  const dispatch = useDispatch();

  const redirectToAuth = () => {
    if (userStatus === 'unauthorized') {
      dispatch(push('/'));
    }
  };

  useEffect(redirectToAuth, [redirectToAuth]);

  return (
    <div className={s.App}>
      <Switch>
        <Route exact path="/" component={Auth} />
        <Route path="/home" render={() => <h1>Welcome</h1>} />
        <Route path="*" render={() => <h1>PAGE NOT FOUND</h1>} />
      </Switch>
    </div>
  );
};

export default App;
