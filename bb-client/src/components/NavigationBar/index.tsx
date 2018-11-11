// tslint:disable: no-unsafe-any

import moment from "moment";
import React from "react";
import { SingleDatePicker } from "react-dates";
import "react-dates/initialize";
import { Link } from "react-router-dom";
import { Button, Col, Form, FormGroup, Input, Label, Nav, Navbar, NavbarBrand, NavItem } from "reactstrap";
import Rodal from "rodal";
import AutoCompletionSearchBar from "../AutoSuggestion";
import "../resources/css/NavigationBar.css";
import { default as logo } from "../resources/images/logo_icon.png";

interface IAppState {
	createdAt: moment.Moment | null;
	calendarFocused: boolean;
	visible: boolean;
}

export default class NavigationBar extends React.Component<{}, IAppState> {
	constructor(props: Readonly<{}>) {
		super(props);

		this.onDateChange = this.onDateChange.bind(this);
		this.onFocusChange = this.onFocusChange.bind(this);
		this.state = {
			createdAt: moment(),
			calendarFocused: false,
			visible: false,
		};
	}

	public showModal(): void {
		this.setState({
			visible: true,
		});
	}

	public hideModal(): void {
		this.setState({
			visible: false,
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
					<Link to="/">
						<NavbarBrand>
							<span><img className="brand" src={logo} height="30" /></span>
						</NavbarBrand>
					</Link>
					<Nav className="ml-auto" navbar>
						<NavItem>
							{/* This button triggers our modal (Rodal) */}
							<Button className="float-right" type="submit" onClick={this.showModal.bind(this)} id="login">Filters</Button>
						</NavItem>
					</Nav>
				</Navbar>

				<Rodal visible={this.state.visible} onClose={this.hideModal.bind(this)}>
					<div className="header">Filters</div>
					<div className="body">
						<Form>
							<FormGroup row>
								<Label for="search" sm={2}>Search</Label>
								<Col sm={10}>
									<AutoCompletionSearchBar />
								</Col>
							</FormGroup>

							<FormGroup row>
								<Label for="guest" sm={2}>Guest</Label>
								<Col sm={10}>
									<Input type="select" name="guest" id="guest">
										<option value="Guests" disabled>Guests</option>
										<option>1</option>
										<option>2</option>
										<option>3</option>
										<option>4</option>
										<option>5</option>
									</Input>
								</Col>
							</FormGroup>

							<FormGroup row>
								<Label for="date" sm={2}>Date</Label>
								<Col sm={10}>
									<SingleDatePicker
										date={this.state.createdAt}
										focused={this.state.calendarFocused}
										onDateChange={this.onDateChange}
										onFocusChange={this.onFocusChange}
										id={"datepicker"}
										small={true}
										numberOfMonths={1}
									/>
								</Col>
							</FormGroup>

							<Button className="float-right"> Submit </Button>
						</Form>
					</div>
				</Rodal>
			</div>
		);
	}
}
