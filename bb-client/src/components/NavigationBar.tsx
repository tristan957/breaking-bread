// tslint:disable: no-unsafe-any
import moment from "moment";
import React from "react";
import "react-dates/initialize";
import ReactMde from "react-mde";
import "react-mde/lib/styles/css/react-mde-all.css";
import MediaQuery from "react-responsive";
import { Button, ButtonGroup, Col, Dropdown, DropdownItem, DropdownMenu, DropdownToggle, Form, FormGroup, Input, InputGroup, Label, Modal, ModalBody, ModalFooter, ModalHeader, Nav, Navbar, NavbarBrand, NavItem } from "reactstrap";
import Showdown from "showdown";
import { UserContext } from "../App";
import { Auth0Authentication } from "../auth/Auth0Authentication";
import GeoSuggest from "./GeoSuggest";
import "./resources/css/NavigationBar.css";
import { default as fullLogo } from "./resources/images/bb-logo-full.png";
import { default as icon } from "./resources/images/icon.png";
import S3ImageUploader from "./S3ImageUploader";

interface INavigationBarState {
	createdAt: moment.Moment | null;
	calendarFocused: boolean;
	dropDown: boolean;
	mealModal: boolean;
	recipeModal: boolean;
	mdeState: string | undefined;
	logoutModal: boolean;
}

interface INavigationBarProps {
	auth: Auth0Authentication;
}

export default class NavigationBar extends React.Component<INavigationBarProps, INavigationBarState> {
	public converter: Showdown.Converter;
	constructor(props: INavigationBarProps) {
		super(props);

		this.state = {
			createdAt: moment(),
			calendarFocused: false,
			dropDown: false,
			mealModal: false,
			recipeModal: false,
			mdeState: undefined,
			logoutModal: false,
		};

		this.converter = new Showdown.Converter({
			tables: true,
			simplifiedAutoLink: true,
		});
	}

	public login = () => {
		this.props.auth.login();
	}

	public logout = (reloadUser: Function) => {
		this.props.auth.logout();
		reloadUser();
	}

	public onSuggestSelect = (suggest: any): void => {
		console.log(suggest);
	}

	public toggleLogoutModal = (): void => {
		this.setState({
			logoutModal: !this.state.logoutModal,
		});
	}

	public toggleDropDown = (): void => {
		this.setState({
			dropDown: !this.state.dropDown,
		});
	}

	public toggleMealModal = (): void => {
		this.setState({
			mealModal: !this.state.mealModal,
		});
	}

	public toggleRecipeModal = (): void => {
		this.setState({
			recipeModal: !this.state.recipeModal,
		});
	}

	public onDateChange = (date: moment.Moment | null): void => {
		this.setState({
			createdAt: date,
		});
	}

	public onFocusChange = (): void => {
		this.setState({
			calendarFocused: !this.state.calendarFocused,
		});
	}

	public handleValueChange = (mdeState: string) => {
		this.setState({ mdeState });
	}

	public generateMarkdownPreview = (markdown: string) => {
		return this.converter.makeHtml(markdown);
	}

	public uploadS3Image = (): void => {
		// this.refs.child.submit();
		// this.props.children.
	}

	public render(): JSX.Element {
		const firstColumnWidth = 3;
		const secondColumnWidth = 12 - firstColumnWidth;

		const { authenticated }: { authenticated: boolean } = this.props.auth;

		return (
			<UserContext.Consumer>
				{userContext => {
					return (
						<div id="navbar">
							<Navbar color="light" light expand="md">
								<NavbarBrand href="/" className="bb-navbar-brand">
									<MediaQuery query="(max-width: 499px)">
										<div id="bb-brand-container"><img id="bb-brand" src={icon} height={30} /></div>
									</MediaQuery>
									<MediaQuery query="(min-width: 500px)">
										<div id="bb-brand-container"><img id="bb-brand" src={fullLogo} height={30} /></div>
									</MediaQuery>
								</NavbarBrand>
								<Nav className="ml-auto" navbar>
									<NavItem>
										{!authenticated && (
											<Button onClick={this.login}>Login</Button>
										)}
										{authenticated && (
											<Button onClick={(): void => this.toggleLogoutModal()}>Logout</Button>
										)}
									</NavItem>
									<NavItem>
										{authenticated && (
											<ButtonGroup>
												<Dropdown isOpen={this.state.dropDown} toggle={this.toggleDropDown}>
													<DropdownToggle> + </DropdownToggle>
													<DropdownMenu>
														<DropdownItem onClick={this.toggleMealModal}>New Meal</DropdownItem>
														<DropdownItem divider />
														<DropdownItem onClick={this.toggleRecipeModal}>New Receipe</DropdownItem>
													</DropdownMenu>
												</Dropdown>
											</ButtonGroup>
										)}
									</NavItem>
								</Nav>
							</Navbar>

							{/* Logout Modal */}
							<Modal size={"sm"} centered={true} isOpen={this.state.logoutModal} toggle={this.toggleLogoutModal}>
								<ModalHeader toggle={this.toggleLogoutModal}>Sign Out?</ModalHeader>
								<ModalBody>
									Are you sure you wish to sign out?
								</ModalBody>
								<ModalFooter>
									<Button className="float-right" onClick={(): void => this.logout(userContext.reloadUser!)}>Yes</Button>
									<Button className="float-right" onClick={this.toggleLogoutModal}>No</Button>
								</ModalFooter>
							</Modal>

							{/* MEAL MODAL */}
							<Modal size={"lg"} centered={true} isOpen={this.state.mealModal} toggle={this.toggleMealModal}>
								<ModalHeader toggle={this.toggleMealModal}>New Meal</ModalHeader>
								<ModalBody>
									<Form>
										<FormGroup row>
											<Label for="date" sm={firstColumnWidth}>Date</Label>
											<Col sm={secondColumnWidth}>
												<Input type="date" name="date" id="navbar-date" />
											</Col>
										</FormGroup>
										<FormGroup row>
											<Label for="time" sm={firstColumnWidth}>Time</Label>
											<Col sm={secondColumnWidth}>
												<Input type="time" name="time" id="navbar-time" defaultValue="12:00" />
											</Col>
										</FormGroup>
										<FormGroup row>
											<Label for="location" sm={firstColumnWidth}>Location</Label>
											<Col sm={secondColumnWidth}>
												<GeoSuggest />
											</Col>
										</FormGroup>
										<FormGroup row>
											<Label for="description" sm={firstColumnWidth}>Meal Description</Label>
											<Col sm={secondColumnWidth}>
												<div className="navbar-description-container">
													<ReactMde
														onChange={this.handleValueChange}
														generateMarkdownPreview={markdown =>
															Promise.resolve(this.converter.makeHtml(markdown))}
														buttonContentOptions={{
															iconProvider: name => <i className={`fa fa-${name}`} />,
														}}
													/>
												</div>
											</Col>
										</FormGroup>
										<FormGroup row>
											<Label for="tags" sm={firstColumnWidth}>Tags</Label>
											<Col sm={secondColumnWidth}>
												<Input type="text" name="tags" id="navbar-tags" />
											</Col>
										</FormGroup>
										<FormGroup row>
											<Label for="guests" sm={firstColumnWidth}>Number of Guests</Label>
											<Col sm={secondColumnWidth}>
												<InputGroup>
													<Input type="number" max={10} min={1} step="1" />
												</InputGroup>
											</Col>
										</FormGroup>
										<FormGroup row>
											<Label for="images" sm={firstColumnWidth}>Upload image(s)</Label>
											<Col sm={secondColumnWidth}>
												{/* <CustomInput type="file" id="navbar-images" name="file" /> */}
												<S3ImageUploader folderName="mealImage" />
											</Col>
										</FormGroup>
									</Form>
								</ModalBody>
								<ModalFooter>
									<Button className="float-right">Invite</Button>
									<Button className="float-right">Submit</Button>
								</ModalFooter>
							</Modal>

							{/* RECIPE MODAL */}
							<Modal size={"lg"} centered={true} isOpen={this.state.recipeModal} toggle={this.toggleRecipeModal}>
								<ModalHeader toggle={this.toggleRecipeModal}>New Recipe</ModalHeader>
								<ModalBody>
									<Form>
										<FormGroup row>
											<Label for="description" sm={firstColumnWidth}>Recipe Description</Label>
											<Col sm={secondColumnWidth}>
												<div className="navbar-description-container">
													<ReactMde
														onChange={this.handleValueChange}
														generateMarkdownPreview={markdown =>
															Promise.resolve(this.converter.makeHtml(markdown))}
														buttonContentOptions={{
															iconProvider: name => <i className={`fa fa-${name}`} />,
														}}
													/>
												</div>
											</Col>
										</FormGroup>
										<FormGroup row>
											<Label for="tags" sm={firstColumnWidth}>Tags</Label>
											<Col sm={secondColumnWidth}>
												<Input type="text" name="tags" id="navbar-tags" />
											</Col>
										</FormGroup>
										<FormGroup row>
											<Label for="images" sm={firstColumnWidth}>Upload image(s)</Label>
											<Col sm={secondColumnWidth}>
												{/* <CustomInput type="file" id="navbar-images" name="file" /> */}
												<S3ImageUploader ref={"child"} folderName="recipeImage" />
											</Col>
										</FormGroup>
									</Form>
								</ModalBody>
								<ModalFooter>
									<Button className="float-right">Submit</Button>
								</ModalFooter>
							</Modal>
						</div>
					);
				}}
			</UserContext.Consumer>
		);
	}
}
