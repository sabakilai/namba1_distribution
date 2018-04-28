import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import  Main  from './routes/Main.js';
import  Login  from './routes/Login.js';
import  Navigation  from './components/Navigation';

class App extends Component {

  render() {
    return (
      <Router>
        <div>
          <Navigation/>
          <Route exact path="/"  component={ Main }  />
          <Route exact path="/login" component={ Login } />
        </div>
      </Router>
    );
  }
}

export default App;
