import Button from '@material-ui/core/Button';
import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Footer from './components/FooterComponent/Footer';
import FormExample from './components/FormExample';
import NavBar from './components/HeaderComponent/Header';
import HomePage from './components/HomePage';

class App extends Component {
  render(): JSX.Element {
    return (
      <Router>
        <div id="continer">
          <div id="header">
            <NavBar />
          </div>
          <div id="content">
            <Route name="home" exact path="/" component={HomePage} />
            <FormExample />
            <Button variant="contained" color="primary">
              Hello World
    </Button>
          </div>
          <div id="footer">
            <Footer />
          </div>
        </div>
      </Router>
    )
  }
}

export default App;