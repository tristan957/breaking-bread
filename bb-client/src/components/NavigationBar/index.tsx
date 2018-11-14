// tslint:disable: no-unsafe-any

import moment from "moment";
import React from "react";
import { DateRangePicker } from "react-dates";
import "react-dates/initialize";
import { Link } from "react-router-dom";
import { Button, Col, Form, FormGroup, Input, Label, Nav, Navbar, NavbarBrand, NavItem } from "reactstrap";
import Rodal from "rodal";
import AutoCompletionSearchBar from "../AutoSuggestion";
import "../resources/css/NavigationBar.css";
import { default as logo } from "../resources/images/logo_icon.png";

interface IAppState {
	startDate: moment.Moment | null;
	endDate: moment.Moment | null;
	focusedInput: "startDate" | "endDate" | null;
	visible: boolean;
	color: boolean;
}

export default class NavigationBar extends React.Component<{}, IAppState> {
	constructor(props: Readonly<{}>) {
		super(props);

		this.onDateChange = this.onDateChange.bind(this);
		this.onFocusChange = this.onFocusChange.bind(this);
		this.state = {
			startDate: moment(),
			endDate: moment(),
			// tslint:disable-next-line:no-null-keyword
			focusedInput: null,
			visible: false,
			color: false,
		};
	}

	public showModal(): void {
		this.setState({
			visible: true,
			color: !this.state.color,
		});
	}

	public hideModal(): void {
		this.setState({
			visible: false,
			color: !this.state.color,
		});
	}

	public onDateChange(arg: { startDate: moment.Moment | null; endDate: moment.Moment | null }): void {
		this.setState({
			startDate: arg.startDate,
			endDate: arg.endDate,
		});
	}

	public onFocusChange(focusedInput: "startDate" | "endDate" | null): void {
		this.setState({
			focusedInput,
		});
	}

	public render(): JSX.Element {
		const btncolor = this.state.color ? "inverse-btn" : "btn-secondary";
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
							<Button className={btncolor} type="submit" onClick={this.showModal.bind(this)} id="login">Filters</Button>
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
									<DateRangePicker
										startDateId={"sdid"}
										endDateId={"edid"}
										startDate={this.state.startDate}
										endDate={this.state.endDate}
										onDatesChange={this.onDateChange}
										focusedInput={this.state.focusedInput}
										onFocusChange={this.onFocusChange}
										startDatePlaceholderText={"Start Date"}
										endDatePlaceholderText={"End Date"}
										small={true}
										numberOfMonths={1}
									/>
								</Col>
							</FormGroup>

							<Button className="float-right submit-btn"> Submit </Button>
						</Form>
					</div>
				</Rodal>
			</div>
		);
	}
}
