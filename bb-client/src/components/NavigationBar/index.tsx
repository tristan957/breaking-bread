// tslint:disable: no-unsafe-any

import React from "react";
import "react-dates/initialize";
import { Link } from "react-router-dom";
import { Nav, Navbar, NavbarBrand, NavItem } from "reactstrap";
import "../resources/css/NavigationBar.css";
import { default as logo } from "../resources/images/logo_icon.png";

interface IAppState { }

export default class NavigationBar extends React.Component<{}, IAppState> {
	constructor(props: Readonly<{}>) {
		super(props);
	}

	public render(): JSX.Element {
		return (
			<div id="navbar">
				<Navbar color="light" light expand="md">
					<Link to="/">
						<NavbarBrand>
							<span><img className="brand" src={logo} height="30" /></span>
						</NavbarBrand>
					</Link>
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
