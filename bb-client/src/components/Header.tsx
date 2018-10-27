// tslint:disable
import autobind from 'autobind-decorator';
import * as React from "react";
import { Collapse, Nav, Navbar, NavbarBrand, NavbarToggler, NavItem, NavLink } from 'reactstrap';
import { Auth0Authentication } from '../auth/Auth0Authentication';
import "./resources/css/Font.css";
import "./resources/css/Header.css";
import * as logo from "./resources/images/logo_icon.png";

type AppProps = {
	auth: Auth0Authentication,
}
type AppState = {
	isOpen: boolean,
}

export default class Header extends React.Component<AppProps, AppState> {
	constructor(props) {
		super(props);
		this.toggle = this.toggle.bind(this);
		this.state = {
			isOpen: false
		};
	}

	toggle() {
		this.setState({ isOpen: !this.state.isOpen });
	}

	@autobind
	login() {
		this.props.auth.login();
	}

	@autobind
	logout() {
		this.props.auth.logout();
	}

	public render(): JSX.Element {
		// const { authenticated } = this.props.auth;
		return (
			<Navbar light expand="md">
				<NavbarBrand href="/">
					Breaking Bread
					<span><img src={logo} height="25" /></span>
				</NavbarBrand>
				<NavbarToggler onClick={this.toggle} />
				<Collapse isOpen={this.state.isOpen} navbar>
					<Nav className="ml-auto" navbar>
						<NavItem>
							<NavLink onClick={this.login}>Log in / Sign up</NavLink>
						</NavItem>
					</Nav>
				</Collapse>
			</Navbar>
		);
	}
}
