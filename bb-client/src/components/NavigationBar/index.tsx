import moment from "moment";
import React from "react";
import DatePicker from "react-datepicker";
import { Button, Col, Container, Form, FormGroup, Input, NavbarBrand, Row } from "reactstrap";
import "../resources/css/NavigationBar.css";
import logo from "../resources/images/logo_icon.png";

type AppProps = {};

type AppState = {
	isOpen: boolean;
	// tslint:disable-next-line:no-any
	startDate: any;
};

export default class NavigationBar extends React.Component<AppProps, AppState> {
	constructor(props: Readonly<AppProps>) {
		super(props);
		this.toggle = this.toggle.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.state = {
			isOpen: false,
			startDate: moment(),
		};
	}

	public toggle(): void {
		this.setState({ isOpen: !this.state.isOpen });
	}

	// tslint:disable-next-line:no-any
	public handleChange(date: any): void {
		this.setState({
			startDate: date,
		});
	}

	public render(): JSX.Element {
		return (
			<div id="navbar">
				<Container>
					<Row>
						<Col xs="1">
							<NavbarBrand href="/">
								<span><img src={logo} height="50" /></span>
							</NavbarBrand>
						</Col>
						<Col xs="6">
							<Form>
								<FormGroup>
									<Input type="search" name="search" id="search" placeholder="Search" />
								</FormGroup>
							</Form>
						</Col>

						<Col xs="2">
							<Form>
								<Input type="select" name="guest" id="guest">
									<option value="" disabled selected>Guests</option>
									<option>1</option>
									<option>2</option>
									<option>3</option>
								</Input>
							</Form>
						</Col>

						{/*
						<Col xs="2">
							<Calendar format="DD/MM/YYYY" date="4-12-2014" />
						</Col>
						*/}

						<Col xs="2">
							<DatePicker
								selected={this.state.startDate}
								onChange={this.handleChange}
								showTimeSelect
								timeFormat="HH:mm"
								timeIntervals={15}
								dateFormat="LLL"
								timeCaption="time"
							/>
						</Col>

						{/* <Button color="danger" onClick={() => this.toggleCalendar > Danger!</Button> */}

						<Col xs="1">
							<Button type="submit" id="login"> Log In </Button>
						</Col>
					</Row>
				</Container>
			</div >
		);
	}
}
