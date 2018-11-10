import moment from "moment";
import React from "react";
import { SingleDatePicker } from "react-dates";
import "react-dates/initialize";
import { Button, Collapse, Form, FormGroup, Input, Nav, Navbar, NavbarBrand, NavbarToggler, NavItem } from "reactstrap";
import Rodal from "rodal";
import "../resources/css/NavigationBar.css";
import logo from "../resources/images/logo_icon.png";

interface IAppState {
	isOpen: boolean;
	createdAt: moment.Moment | null;
	calendarFocused: boolean;
	visible: boolean;
}

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
			visible: false,
		};
	}

	public show(): void {
		this.setState({
			visible: true,
		});
	}

	public hide(): void {
		this.setState({
			visible: false,
		});
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
						<span><img src={logo} height="40" /></span>
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
								<Button type="submit" onClick={this.show.bind(this)} id="login">Modal Test</Button>
							</NavItem>
						</Nav>
					</Collapse>
				</Navbar>
				<Rodal width={800} height={500} visible={this.state.visible} onClose={this.hide.bind(this)}>
					<div className="header">modal test</div>
					<div className="body">What the fuck did you just fucking say about me, you little bitch? I'll have you know I graduated top of my class in the Navy Seals, and I've been involved in numerous secret raids on Al-Quaeda, and I have over 300 confirmed kills. I am trained in gorilla warfare and I'm the top sniper in the entire US armed forces. You are nothing to me but just another target. I will wipe you the fuck out with precision the likes of which has never been seen before on this Earth, mark my fucking words. You think you can get away with saying that shit to me over the Internet? Think again, fucker. As we speak I am contacting my secret network of spies across the USA and your IP is being traced right now so you better prepare for the storm, maggot. The storm that wipes out the pathetic little thing you call your life. You're fucking dead, kid. I can be anywhere, anytime, and I can kill you in over seven hundred ways, and that's just with my bare hands. Not only am I extensively trained in unarmed combat, but I have access to the entire arsenal of the United States Marine Corps and I will use it to its full extent to wipe your miserable ass off the face of the continent, you little shit. If only you could have known what unholy retribution your little "clever" comment was about to bring down upon you, maybe you would have held your fucking tongue. But you couldn't, you didn't, and now you're paying the price, you goddamn idiot. I will shit fury all over you and you will drown in it. You're fucking dead, kiddo.</div>
				</Rodal>
			</div >
		);
	}
}
