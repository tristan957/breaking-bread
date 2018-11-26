// tslint:disable: no-unsafe-any

import React from "react";
import "react-dates/initialize";
import { Nav, Navbar, NavbarBrand, NavItem } from "reactstrap";
import "./resources/css/NavigationBar.css";
import { default as logo } from "./resources/images/logo_icon.png";

export default class NavigationBar extends React.Component {
	public render(): JSX.Element {
		return (
			<div id="navbar">
				<Navbar color="light" light expand="md">
					<NavbarBrand href="/" className="bb-navbar-brand">
						<div><img className="brand" src={logo} height="30" /></div>
					</NavbarBrand>
					<Nav className="ml-auto" navbar>
						<NavItem>
							{/* This button triggers our modal (Rodal) */}
						</NavItem>
					</Nav>
				</Navbar>
			</div>
		);
	}
}
