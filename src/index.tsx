import React from 'react';
//import ReactDOM, { render } from 'react-dom';

import './index.css';
import App from './components/AppWithRedux';  // from "./AppWithReducers" or "./App"
import * as serviceWorker from './serviceWorker';
import {Provider} from "react-redux";
import {store} from "./state/store";
import ReactDOM from 'react-dom/client'; // from React 18

// from React 17
// render(
//   <Provider store={store}>
//      <App/>
//   </Provider>,  document.getElementById('root'));


// from React 18
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
     <Provider store={store}>
     <App />
     </Provider>
  </React.StrictMode>
);



// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
