import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import NavBar from './components/HeaderComponent/Header';
import Footer from './components/FooterComponent/Footer';
class App extends Component {
    render() {
        return (React.createElement(Router, null,
            React.createElement("div", null,
                React.createElement(NavBar, null),
                React.createElement(Route, { name: "home", exact: true, path: "/", component: HomePage }),
                React.createElement(Footer, null))));
    }
}
export default App;
//# sourceMappingURL=App.js.map