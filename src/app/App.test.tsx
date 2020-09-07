import React from 'react';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import { shallow } from 'enzyme';
import { store, history } from '../store';
import App from './App';

describe('App', () => {
  it('renders without crashing', () => {
    shallow(
      <Provider store={store}>
        <ConnectedRouter history={history}>
          <App />
        </ConnectedRouter>
      </Provider>
    );
  });
});