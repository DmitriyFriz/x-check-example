import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import { store, history } from './store';
import './index.css';
import App from './app/App';
import * as serviceWorker from './serviceWorker';
import Api from './services/XCheckApi';

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <App />
      </ConnectedRouter>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

const api = new Api();

// api.signIn({
//   githubId: 'jack',
//   role: 'author',
// });

// api.createTask({
//   id: 'TEST-task-v1111111111',
//   author: 'cardamo',
//   state: 'DRAFT',
//   categoriesOrder: ['Basic Scope', 'Extra Scope', 'Fines'],
//   items: [
//     {
//       id: 'basic_p1',
//       minScore: 0,
//       maxScore: 20,
//       category: 'Basic Scope',
//       title: 'Basic things',
//       description: 'You need to make things right, not wrong',
//     },
//   ],
// });

// api.createTask({
//   id: 'TEST-task-v2',
//   author: 'JACK',
//   state: 'DRAFT',
//   categoriesOrder: ['Basic Scope', 'Extra Scope', 'Fines'],
//   items: [
//     {
//       id: 'basic_p1',
//       minScore: 0,
//       maxScore: 20,
//       category: 'Basic Scope',
//       title: 'Basic things',
//       description: 'You need to make things right, not wrong',
//     },
//   ],
// });

api.deleteTask('TEST-task-v2');

api.getTasks();

// api.updateTask('TEST-task-v2', {
//   id: 'TEST-task-v1111111111',
//   author: 'JACK!!!!!!!!!',
//   state: 'DRAFT',
//   categoriesOrder: ['Basic Scope', 'Extra Scope', 'Fines'],
//   items: [
//     {
//       id: 'basic_p1',
//       minScore: 0,
//       maxScore: 2000000000,
//       category: 'Basic Scope',
//       title: 'Basic things',
//       description: 'You need to make things right, not wrong',
//     },
//   ],
// });

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
