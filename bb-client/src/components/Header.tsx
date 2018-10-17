import * as React from "react";
import { Nav, Navbar, NavItem } from "react-bootstrap";
import "./resources/css/Header.css";

export default class Header extends React.Component {
	public render(): JSX.Element {
		return (
			<Navbar inverse={true} collapseOnSelect={true}>
				<Navbar.Header>
					<Navbar.Brand href="#">
						<span><img src="./resources/images/logo_icon.png" height="30" className="d-inline-block align-top" /></span>
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
