// tslint:disable: no-unsafe-any
import moment from "moment";
import React from "react";
import { SingleDatePicker } from "react-dates";
import "react-dates/initialize";
import { Button, Collapse, Form, FormGroup, Input, Nav, Navbar, NavbarBrand, NavbarToggler, NavItem } from "reactstrap";
import "../resources/css/NavigationBar.css";
import logo from "../resources/images/logo_icon.png";

interface IAppState {
	isOpen: boolean;
<<<<<<< HEAD
	createdAt: moment.Moment | null;
	calendarFocused: boolean;
};
=======
	// tslint:disable-next-line:no-any
	startDate: any;
}
>>>>>>> 7d71a5b75e360a82a536e676cc7834d4f9fa2226

export default class NavigationBar extends React.Component<{}, IAppState> {
	constructor(props: Readonly<{}>) {
		super(props);
		this.toggle = this.toggle.bind(this);
		this.onDateChange = this.onDateChange.bind(this);
		this.onFocusChange = this.onFocusChange.bind(this);
		this.state = {
			isOpen: false,
			createdAt: moment(),
			calendarFocused: false,
		};
	}

	public toggle(): void {
		this.setState({
			isOpen: !this.state.isOpen,
		});
	}

	public onDateChange(date: moment.Moment | null): void {
		this.setState({
			createdAt: date,
		});
	}

	public onFocusChange(): void {
		this.setState({
			calendarFocused: !this.state.calendarFocused,
		});
	}

	public render(): JSX.Element {
		return (
			<div id="navbar">
				<Navbar color="light" light expand="md">
					<NavbarBrand href="/">
						<span><img src={logo} height="45" /></span>
					</NavbarBrand>
					<NavbarToggler onClick={this.toggle} />
					<Collapse isOpen={this.state.isOpen} navbar>
						<Nav className="ml-auto" navbar>
							<NavItem>
								<Form>
									<FormGroup>
										<Input type="search" name="search" id="search" placeholder="Search" />
									</FormGroup>
								</Form>
							</NavItem>

							<NavItem>
								<Form>
									<Input type="select" name="guest" id="guest">
										<option value="" disabled selected>Guests</option>
										<option>1</option>
										<option>2</option>
										<option>3</option>
										<option>4</option>
										<option>5</option>
									</Input>
								</Form>
							</NavItem>

							<NavItem>
								<SingleDatePicker
									date={this.state.createdAt}
									focused={this.state.calendarFocused}
									onDateChange={this.onDateChange}
									onFocusChange={this.onFocusChange}
									id={"datepicker"}
									small={true}
								/>
							</NavItem>

							<NavItem>
								<Button type="submit" id="login"> Log In </Button>
							</NavItem>
						</Nav>
					</Collapse>
				</Navbar>
			</div >
		);
	}
}
