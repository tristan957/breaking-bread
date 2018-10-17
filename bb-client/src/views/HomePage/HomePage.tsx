import React, { Component } from 'react';
import Background from '../../components/Background/Background';
import Footer from '../../components/Footer/Footer';
import FormExample from '../../components/FormExample';
import NavBar from '../../components/Header/Header';
import './HomePage.css';

class HomePage extends Component {
  render() {
    return (
      <div id="container">
        <div id="header">
          <NavBar />
        </div>

        <div id="content">
          <Background />
          <FormExample />
        </div>

        <div id="footer">
          <Footer />
        </div>
      </div>
    )
  }
}

export default HomePage;