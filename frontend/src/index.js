import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import reportWebVitals from './reportWebVitals';
import $ from 'jquery';
import Popper from 'popper.js';
import '@fortawesome/fontawesome-free/css/all.min.css';
import '@fortawesome/fontawesome-free/js/all.min.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';
import {Provider} from 'react-redux'
import store from './store'
import {positions, transitions, Provider as AlertProvider} from 'react-alert'
import AlertTemplate from 'react-alert-template-basic'

const options = {
  timeout: 10000,
  position: positions.BOTTOM_RIGHT,
  transition: transitions.SCALE
}



ReactDOM.render(
  <Provider store={store}>
    <AlertProvider template={AlertTemplate} {...options}>
      <App />
    </AlertProvider>
  </Provider>,
  document.getElementById('root')
);

reportWebVitals();
