// tslint:disable: no-unsafe-any
import ApolloClient from "apollo-client";
import gql from "graphql-tag";
import moment from "moment";
import React from "react";
import { ApolloConsumer } from "react-apollo";
import "react-dates/initialize";
import ReactMde from "react-mde";
import "react-mde/lib/styles/css/react-mde-all.css";
import MediaQuery from "react-responsive";
import { Button, ButtonGroup, Col, CustomInput, Dropdown, DropdownItem, DropdownMenu, DropdownToggle, Form, FormFeedback, FormGroup, FormText, Input, InputGroup, Label, Modal, ModalBody, ModalHeader, Nav, Navbar, NavbarBrand, NavItem } from "reactstrap";
import Showdown from "showdown";
import { Auth0Authentication } from "../auth/Auth0Authentication";
import GeoSuggest from "./GeoSuggest";
import "./resources/css/NavigationBar.css";
import { default as fullLogo } from "./resources/images/bb-logo-full.png";
import { default as icon } from "./resources/images/icon.png";

const USER_RECIPES = gql`

`;

type MealForm = {
	valid: {
		date: boolean;
	};
	date?: string;
	startTime?: string;
	endTime?: string;
	description?: string;
	guests?: string;
	image?: string;
	location?: string;
};

type RecipeForm = {
	name?: string;
	description?: string;
	// tags?: string;
	image?: string;
};

const CREATE_RECIPE_MUTATION = gql`
	mutation RecipeSave($input: RecipeSaveInput!) {
		recipeSave(input: $input) {
			id
		}
	}
`;

interface IRecipeSaveInput {
	name: string;
	description: string;
	imagePath?: string;
}

interface INavigationBarState {
	createdAt: moment.Moment | null;
	calendarFocused: boolean;
	dropDown: boolean;
	mealModal: boolean;
	recipeModal: boolean;
	mealForm: MealForm;
	recipeForm: RecipeForm;
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
			mealForm: {
				valid: {
					date: true,
				},
			},
			recipeForm: {},
		};

		this.converter = new Showdown.Converter({
			tables: true,
			simplifiedAutoLink: true,
		});
	}

	private mealSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		console.log(this.state.mealForm);

		e.preventDefault();
	}

	public login = () => {
		this.props.auth.login();
	}

	public logout = () => {
		this.props.auth.logout();
	}

	public onSuggestSelect = (suggest: any): void => {
		console.log(suggest);
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

	public generateMarkdownPreview = (markdown: string) => {
		return this.converter.makeHtml(markdown);
	}

	public createRecipeMutation = (client: ApolloClient<any>, variables: IRecipeSaveInput) => {
		client.mutate({
			mutation: CREATE_RECIPE_MUTATION,
			variables,
		}).then(() => {
			this.toggleRecipeModal();
		}).catch((err) => {
			console.log(err);
		});
	}

	public render(): JSX.Element {
		const firstColumnWidth = 3;
		const secondColumnWidth = 12 - firstColumnWidth;

		const { authenticated }: { authenticated: boolean } = this.props.auth;

		return (
			<ApolloConsumer>
				{(client) => {
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
											<Button onClick={this.logout}>Logout</Button>
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

							{/* MEAL MODAL */}
							<Modal size={"lg"} centered={true} isOpen={this.state.mealModal} toggle={this.toggleMealModal}>
								<ModalHeader toggle={this.toggleMealModal}>New Meal</ModalHeader>
								<ModalBody>
									<Form onSubmit={this.mealSubmit}>
										<FormGroup row>
											<Label for="date" sm={firstColumnWidth}>Date</Label>
											<Col sm={secondColumnWidth}>
												<Input type="date" name="date" id="navbar-date" onChange={(e: React.ChangeEvent<HTMLInputElement>) => this.setState({ ...this.state, mealForm: { ...this.state.mealForm, date: e.target.value } })} />
												<FormFeedback>Meal is either in the past or further than one year in advance</FormFeedback>
												<FormText>Meals can only be made a year in advance</FormText>
											</Col>
										</FormGroup>
										<FormGroup row>
											<Label for="startTime" sm={firstColumnWidth}>Start Time</Label>
											<Col sm={secondColumnWidth}>
												<Input type="time" name="startTime" id="navbar-startTime" onChange={(e: React.ChangeEvent<HTMLInputElement>) => this.setState({ ...this.state, mealForm: { ...this.state.mealForm, startTime: e.target.value } })} />
												<FormText>Be sure to specify AM or PM</FormText>
											</Col>
										</FormGroup>
										<FormGroup row>
											<Label for="endTime" sm={firstColumnWidth}>End Time</Label>
											<Col sm={secondColumnWidth}>
												<Input type="time" name="endTime" id="navbar-endTime" onChange={(e: React.ChangeEvent<HTMLInputElement>) => this.setState({ ...this.state, mealForm: { ...this.state.mealForm, endTime: e.target.value } })} />
												<FormText>Be sure to specify AM or PM</FormText>
											</Col>
										</FormGroup>
										<FormGroup row>
											<Label for="location" sm={firstColumnWidth}>Location</Label>
											<Col sm={secondColumnWidth}>
												<GeoSuggest onChange={(e: React.ChangeEvent<HTMLInputElement>) => this.setState({ ...this.state, mealForm: { ...this.state.mealForm, location: e.target.value } })} />
											</Col>
										</FormGroup>
										<FormGroup row>
											<Label for="description" sm={firstColumnWidth}>Meal Description</Label>
											<Col sm={secondColumnWidth}>
												<div className="navbar-description-container">
													<ReactMde
														onChange={(value: string) => this.setState({ ...this.state, mealForm: { ...this.state.mealForm, description: value } })}
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
											<Label for="guests" sm={firstColumnWidth}>Number of Guests</Label>
											<Col sm={secondColumnWidth}>
												<InputGroup>
													<Input type="number" min={1} step="1" defaultValue="1" onChange={(e: React.ChangeEvent<HTMLInputElement>) => this.setState({ ...this.state, mealForm: { ...this.state.mealForm, guests: e.target.value } })} />
												</InputGroup>
											</Col>
										</FormGroup>
										<FormGroup row>
											<Label for="image" sm={firstColumnWidth}>Upload image</Label>
											<Col sm={secondColumnWidth}> {/* Only upload one image */}
												<CustomInput type="file" id="navbar-images" name="file" onChange={(e: React.ChangeEvent<HTMLInputElement>) => this.setState({ ...this.state, mealForm: { ...this.state.mealForm, endTime: e.target.value } })} />
											</Col>
										</FormGroup>
										<hr />
										<Button type="submit" className="float-right">Submit</Button>
										<Button className="float-right" onClick={(e: React.MouseEvent<HTMLButtonElement>) => this.setState({ ...this.state, mealModal: !this.state.mealModal })}>Cancel</Button>
									</Form>
								</ModalBody>
							</Modal>

							{/* RECIPE MODAL */}
							<Form onSubmit={() => {
								this.createRecipeMutation(client, {
									name: this.state.recipeForm.name!,
									description: this.state.recipeForm.description!,
									...this.state.recipeForm,
								});
							}}>
								<Modal size={"lg"} centered={true} isOpen={this.state.recipeModal} toggle={this.toggleRecipeModal}>
									<ModalHeader toggle={this.toggleRecipeModal}>New Recipe</ModalHeader>
									<ModalBody>
										<FormGroup row>
											<Label for="name" sm={firstColumnWidth}>Name</Label>
											<Col sm={secondColumnWidth}>
												<Input type="text" name="name" onChange={(e: React.ChangeEvent<HTMLInputElement>) => this.setState({ ...this.state, recipeForm: { ...this.state.recipeForm, name: e.target.value } })} />
											</Col>
										</FormGroup>
										<FormGroup row>
											<Label for="description" sm={firstColumnWidth}>Description</Label>
											<Col sm={secondColumnWidth}>
												<div className="navbar-description-container">
													<ReactMde onChange={(value: string) => this.setState({ ...this.state, recipeForm: { ...this.state.recipeForm, description: value } })}
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
											{/* <Label for="tags" sm={firstColumnWidth}>Tags</Label>
											<Col sm={secondColumnWidth}>
												<Input type="text" name="tags" id="navbar-tags" onChange={(e: React.ChangeEvent<HTMLInputElement>) => this.setState({ ...this.state, recipeForm: { ...this.state.recipeForm, tags: e.target.value } })} />
											</Col> */}
										</FormGroup>
										<FormGroup row>
											<Label for="images" sm={firstColumnWidth}>Upload image</Label>
											<Col sm={secondColumnWidth}>
												<CustomInput type="file" id="navbar-images" name="file" onChange={(e: React.ChangeEvent<HTMLInputElement>) => this.setState({ ...this.state, recipeForm: { ...this.state.recipeForm, image: e.target.value } })} />
											</Col>
										</FormGroup>
										<hr />
										<Button type="submit" className="float-right">Submit</Button>
										<Button className="float-right" onClick={(e: React.MouseEvent<HTMLButtonElement>) => this.setState({ ...this.state, recipeModal: !this.state.recipeModal })}>Cancel</Button>
									</ModalBody>
								</Modal>
							</Form>
						</div>
					);
				}}
			</ApolloConsumer>
		);
	}
}
