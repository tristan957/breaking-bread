import autobind from "autobind-decorator";
import React from "react";
import { Collapse, Nav, Navbar, NavbarBrand, NavbarToggler, NavItem, NavLink } from "reactstrap";
import { Auth0Authentication } from "../auth/Auth0Authentication";
import "./resources/css/Font.css";
import "./resources/css/Header.css";
import logo from "./resources/images/logo_icon.png";

interface IAppProps {
	auth: Auth0Authentication;
}

interface IAppState {
	isOpen: boolean;
}

export default class Header extends React.Component<IAppProps, IAppState> {
	constructor(props: IAppProps) {
		super(props);
		this.toggle = this.toggle.bind(this);
		this.state = {
			isOpen: false,
		};
	}

	public toggle(): void {
		this.setState({ isOpen: !this.state.isOpen });
	}

	@autobind
	public login(): void {
		this.props.auth.login();
	}

	@autobind
	public logout(): void {
		this.props.auth.logout();
	}

	@autobind
	public showToken(): void {
		console.log(localStorage.getItem("access_token"));
	}

	public render(): JSX.Element {
		const { authenticated } = this.props.auth;

		return (
			<Navbar light expand="md">
				<NavbarBrand href="/">
					Breaking Bread
					<span><img src={logo} height="25" /></span>
				</NavbarBrand>
				<NavbarToggler onClick={this.toggle} />
				<Collapse isOpen={this.state.isOpen} navbar>
					<Nav className="ml-auto" navbar>
						{!authenticated && (
							<li className="nav-item">
								<button
									className="btn btn-outline-primary my-2 my-sm-0"
									type="submit"
									onClick={this.login}
								>
									Log In
						</button>
							</li>
						)}
						{authenticated && (
							<li className="nav-item">
								<NavItem>
									<NavLink>Hi, {localStorage.getItem("user_id")}</NavLink>
								</NavItem>
							</li>
						)}
						{authenticated && (
							<li className="nav-item">
								<button
									className="btn btn-outline-primary my-2 my-sm-0"
									type="submit"
									onClick={this.logout}
								>
									Log Out
						</button>
							</li>
						)}
					</Nav>
				</Collapse>
			</Navbar>
		);
	}
}
