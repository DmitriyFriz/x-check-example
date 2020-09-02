import { createStore, compose, applyMiddleware } from 'redux';
import { createBrowserHistory } from 'history';
import { routerMiddleware } from 'connected-react-router';
import thunk from 'redux-thunk';
import rootReducer from './reducers';

export const history = createBrowserHistory();
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const enhancers: Array<any> = [];
const initialState = {};

const composeEnhancers =
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export const store = createStore(
  rootReducer(history),
  initialState,
  composeEnhancers(
    applyMiddleware(routerMiddleware(history), thunk),
    ...enhancers
  )
);

export default store;
