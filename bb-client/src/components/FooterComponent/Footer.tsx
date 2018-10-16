import * as React from 'react';
import { Grid, Nav, NavItem } from 'react-bootstrap';
import './Footer.css'
import { LinkContainer } from 'react-router-bootstrap';

function Footer() {
  return (
    <footer id={"footer"}>
      <Grid>
        <Nav justified={true}>
          <LinkContainer to="/home">
            <NavItem className={"testing"} eventKey={1}>Home</NavItem>
          </LinkContainer>
          <NavItem eventKey={1} href={"#"}>
            Privacy policy
          </NavItem>
          <NavItem bsStyle={"link"} eventKey={2} href={"#"} title="Item">
            Terms & Conditions
          </NavItem>
          <NavItem bsStyle={"link"} eventKey={3} href={"#"}>
            About Us
          </NavItem>
        </Nav>

        <div className="text-center small copyright">
          © Breaking Bread 2018
        </div>
      </Grid>
    </footer>
  );
}

export default Footer;