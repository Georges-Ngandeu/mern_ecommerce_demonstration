import {BrowserRouter as Router, Route}  from 'react-router-dom'
import React, {Fragment, useEffect, useState} from 'react'

import Header from './components/Header'
import Footer from './components/Footer'
import Home from './components/Home'
import Login from './components/Login'
import Cart from './components/Cart'
import Profile from './components/Profile'
import UpdateProfile from './components/UpdateProfile'
import UpdatePassword from './components/UpdatePassword'
import ForgotPassword from './components/ForgotPassword'
import NewPassword from './components/NewPassword'
import Register from './components/Register'
import ProtectedRoute from './components/ProtectedRoute'
import ProductDetails from './components/ProductDetails'

import {loadUser} from './actions/userActions'
import store from './store' 

import './App.css'
import { createRef } from 'react'

function App() {

  useEffect(() => {
    store.dispatch(loadUser())
  })
   
  return (
    <div className="App">
        <Router>
          <Header />
          <div className="container">
            <Route path='/' component={Home} exact/>
            <Route path='/login' component={Login} exact/>
            <Route path='/register' component={Register} exact/>
            <Route path='/cart' component={Cart} exact/>
            <Route path='/password/forgot' component={ForgotPassword} exact/>
            <Route path='/password/reset/:token' component={NewPassword} exact/>
            <ProtectedRoute path='/me' component={Profile} exact/>
            <ProtectedRoute path='/me/update' component={UpdateProfile} exact/>
            <ProtectedRoute path='/password/update' component={UpdatePassword} exact/>
            <Route path='/search/:keyword' component={Home} />
            <Route path='/product/:id' component={ProductDetails} exact/>
          </div>
          <Footer />
        </Router>
    </div>
  );
}

export default App;
