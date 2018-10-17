import * as React from 'react';
import { Nav, Navbar, NavItem } from 'react-bootstrap';
import './Header.css'

class Header extends React.Component<any, any> {
  public render() {
    return (
      <Navbar inverse={true} collapseOnSelect={true}>
        <Navbar.Header>
          <Navbar.Brand href="#">
            <span><img src={require('../../../images/logo_icon.png')} height="30" className="d-inline-block align-top"/></span>
            <span className={"brandname"}>Breaking Bread</span>
          </Navbar.Brand>
          <Navbar.Toggle />
        </Navbar.Header>
        <Navbar.Collapse>
          <Nav pullRight={true}>
            <NavItem eventKey={1} href="#">
              Log In
            </NavItem>
            <NavItem eventKey={2} href="#">
              Sign Up
            </NavItem>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    );
  }
}

export default Header;