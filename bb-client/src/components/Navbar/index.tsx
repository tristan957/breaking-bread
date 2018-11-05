// tslint:disable: no-unsafe-any
import React from "react";
import "react-day-picker/lib/style.css";
import { DropdownItem, DropdownMenu, DropdownToggle, Form, FormGroup, Input, Nav, NavbarBrand, UncontrolledDropdown } from "reactstrap";
import logo from "../resources/images/default_user_pic.png";

type AppState = {
	isOpen: boolean;
};

export default class Navbar extends React.Component<{}, AppState> {
	constructor(props: Readonly<AppState>) {
		super(props);
		this.toggle = this.toggle.bind(this);
		this.state = {
			isOpen: false,
		};
	}

	public toggle(): void {
		this.setState({ isOpen: !this.state.isOpen });
	}

	public render(): JSX.Element {
		return (
			<div id="navbar">
				<Nav pills>
					<NavbarBrand href="/">
						<span><img src={logo} height="25" /></span>
					</NavbarBrand>

					<Form>
						<FormGroup>
							<Input type="search" name="search" id="search" placeholder="search" />
						</FormGroup>
						<Input type="select" name="select" id="exampleSelect">
							<option>$10+</option>
							<option>$20+</option>
						</Input>
					</Form>

					<UncontrolledDropdown setActiveFromChild>
						<DropdownToggle tag="a" className="nav-link" caret>
							user name
						</DropdownToggle>
						<DropdownMenu>
							<DropdownItem tag="a" href="/blah" active>Post</DropdownItem>
							<DropdownItem tag="a" href="/blah" active>log out</DropdownItem>
						</DropdownMenu>
					</UncontrolledDropdown>

				</Nav>
			</div>
		);
	}
}
