import ApolloClient from "apollo-client";
import gql from "graphql-tag";
import React from "react";
import { ApolloConsumer, Query, QueryResult } from "react-apollo";
import "react-dates/initialize";
import { Suggest } from "react-geosuggest";
import ReactMde from "react-mde";
import "react-mde/lib/styles/css/react-mde-all.css";
import MediaQuery from "react-responsive";
import { Button, ButtonGroup, Col, Dropdown, DropdownItem, DropdownMenu, DropdownToggle, Form, FormFeedback, FormGroup, FormText, Input, InputGroup, Label, Modal, ModalBody, ModalFooter, ModalHeader, Nav, Navbar, NavbarBrand, NavItem } from "reactstrap";
import Showdown from "showdown";
import { UserContext } from "../App";
import { Auth0Authentication } from "../auth/Auth0Authentication";
import User from "../entities/User";
import GeoSuggest from "./GeoSuggest";
import "./resources/css/NavigationBar.css";
import { default as fullLogo } from "./resources/images/bb-logo-full.png";
import { default as icon } from "./resources/images/icon.png";

const USER_RECIPES = gql`
	{
		userAuthenticated {
			id
			savedRecipes {
				id
				name
			}
			authoredRecipes {
				id
				name
			}
		}
	}
`;

interface IUserRecipesData {
	userAuthenticated?: Partial<User> | null;
}

type UserRecipesResult = QueryResult<IUserRecipesData>;

type MealForm = {
	date?: string;
	startTime?: string;
	endTime?: string;
	description?: string;
	guests: string;
	price: string;
	title?: string;
	image?: string;
	location?: Suggest;
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
	input: {
		name: string;
		description: string;
		imagePath?: string;
	};
}

const MEAL_SAVE_MUTATION = gql`
	mutation MealSave($input: MealSaveInput!) {
		mealSave(input: $input) {
			id
		}
	}
`;

interface ILocation {
	streetAddress: string;
	lat: number;
	long: number;
}

interface IMealSaveInput {
	input: {
		location?: ILocation;
		startTime: string;
		endTime: string;
		price: number;
		title: string;
		description?: string;
		imagePath?: string;
		maxGuests: number;
	};
}

interface INavigationBarState {
	calendarFocused: boolean;
	dropDown: boolean;
	mealModal: boolean;
	recipeModal: boolean;
	mealForm: MealForm;
	recipeForm: RecipeForm;
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
			calendarFocused: false,
			dropDown: false,
			mealModal: false,
			recipeModal: false,
			mealForm: {
				guests: "1",
				price: "0",
			},
			recipeForm: {},
			mdeState: undefined,
			logoutModal: false,
		};

		this.converter = new Showdown.Converter({
			tables: true,
			simplifiedAutoLink: true,
		});
	}

	// private createSelections = (result: UserRecipesResult): JSX.Element[] => {
	// 	const items: JSX.Element[] = [];
	// 	const recipes = result.data!.userAuthenticated!.authoredRecipes!.concat(result.data!.userAuthenticated!.savedRecipes!);
	// 	let count = 0;
	// 	for (const recipe of recipes) {
	// 		items.push(<option key={count}>{recipe.id} -- {recipe.name}</option>);
	// 		count += 1;
	// 	}

	// 	return items;
	// }

	public login = () => {
		this.props.auth.login();
	}

	public logout = (reloadUser: Function) => {
		this.props.auth.logout();
		reloadUser();
	}

	// public onSuggestSelect = (suggest: any): void => {
	// 	console.log(suggest);
	// }

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

	public onFocusChange = (): void => {
		this.setState({
			calendarFocused: !this.state.calendarFocused,
		});
	}

	public generateMarkdownPreview = (markdown: string) => {
		return this.converter.makeHtml(markdown);
	}

	public isMealFormValid = () => {
		if (
			this.state.mealForm.title === undefined ||
			this.state.mealForm.date === undefined ||
			this.state.mealForm.endTime === undefined ||
			this.state.mealForm.startTime === undefined
		) {
			return false;
		}
		return true;
	}

	public createMealMutation = (client: ApolloClient<any>) => {
		if (!this.isMealFormValid()) {
			return;
		}

		let location: ILocation | undefined = undefined;
		if (this.state.mealForm.location !== undefined) {
			location = {
				streetAddress: this.state.mealForm.location.label,
				lat: parseFloat(this.state.mealForm.location.location.lat),
				long: parseFloat(this.state.mealForm.location.location.lng),
			};
		}

		const startDateTime = new Date(`${this.state.mealForm.startTime} ${this.state.mealForm.date}`);
		const endDateTime = new Date(`${this.state.mealForm.endTime} ${this.state.mealForm.date}`);
		const variables: IMealSaveInput = {
			input: {
				location,
				startTime: startDateTime.toISOString(),
				endTime: endDateTime.toISOString(),
				price: parseFloat(this.state.mealForm.price),
				title: this.state.mealForm.title!,
				description: this.state.mealForm.description,
				maxGuests: parseInt(this.state.mealForm.guests, 10),
			},
		};

		client.mutate({
			mutation: MEAL_SAVE_MUTATION,
			variables,
		}).then(() => {
			this.toggleMealModal();
		}).catch((err) => {
			console.log(err);
		});
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
						<ApolloConsumer>
							{(client: ApolloClient<any>) => {
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
														<Button onClick={this.toggleLogoutModal}>Logout</Button>
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
												<Query query={USER_RECIPES}>
													{(result: UserRecipesResult) => {
														if (result.loading) { return <div></div>; }
														if (result.error) {
															console.error(result.error);
															return <div>{result.error.message}</div>;
														}
														if (result.data!.userAuthenticated === null || result.data!.userAuthenticated === undefined) {
															return (
																<div>
																	Something is wrong
																</div>
															);
														}
														if (result.data!.userAuthenticated!.authoredRecipes === undefined && result.data!.userAuthenticated!.savedRecipes === undefined) {
															return (
																<div>
																	<h3>You have no saved recipes or authored recipes!</h3>
																</div>
															);
														}

														return (
															<Form onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
																this.createMealMutation(client);
																e.preventDefault();
															}}>
																<FormGroup row>
																	<Label for="title" sm={firstColumnWidth}>Title</Label>
																	<Col sm={secondColumnWidth}>
																		<InputGroup>
																			<Input type="text" onChange={(e: React.ChangeEvent<HTMLInputElement>) => this.setState({ ...this.state, mealForm: { ...this.state.mealForm, title: e.target.value } })} />
																		</InputGroup>
																	</Col>
																</FormGroup>
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
																	<Label for="location" sm={firstColumnWidth}>Location (Home address if blank)</Label>
																	<Col sm={secondColumnWidth}>
																		<GeoSuggest onSelect={(suggestion: Suggest) => { this.setState({ ...this.state, mealForm: { ...this.state.mealForm, location: suggestion } }); }} />
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
																	<Label for="price" sm={firstColumnWidth}>Price</Label>
																	<Col sm={secondColumnWidth}>
																		<InputGroup>
																			<Input type="number" min={0} defaultValue="0" onChange={(e: React.ChangeEvent<HTMLInputElement>) => this.setState({ ...this.state, mealForm: { ...this.state.mealForm, price: e.target.value } })} />
																		</InputGroup>
																	</Col>
																</FormGroup>
																{/* <FormGroup row>
																	<Label for="image" sm={firstColumnWidth}>Upload image</Label>
																	<Col sm={secondColumnWidth}>
																		<CustomInput type="file" id="navbar-images" name="file" onChange={(e: React.ChangeEvent<HTMLInputElement>) => this.setState({ ...this.state, mealForm: { ...this.state.mealForm, endTime: e.target.value } })} />
																	</Col>
																</FormGroup> */}
																{/* <FormGroup>
																	<Label for="recipes">Select Recipes</Label>
																	<Input type="select" name="recipes" id="navbar-recipes" multiple onChange={(e: React.ChangeEvent<HTMLInputElement>) => console.log(e.target.value)}>
																		{this.createSelections(result)}
																	</Input>
																</FormGroup> */}
																<hr />
																<Button type="submit" className="float-right">Submit</Button>
																<Button className="float-right" onClick={(e: React.MouseEvent<HTMLButtonElement>) => this.setState({ ...this.state, mealModal: !this.state.mealModal })}>Cancel</Button>
															</Form>
														);
													}}
												</Query>
											</ModalBody>
										</Modal>

										{/* RECIPE MODAL */}
										<Modal size={"lg"} centered={true} isOpen={this.state.recipeModal} toggle={this.toggleRecipeModal}>
											<ModalHeader toggle={this.toggleRecipeModal}>New Recipe</ModalHeader>
											<ModalBody>
												<Form onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
													this.createRecipeMutation(client, {
														input: {
															name: this.state.recipeForm.name!,
															description: this.state.recipeForm.description!,
														},
													});
													e.preventDefault();
												}}>
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
													{/* <FormGroup row>
														<Label for="tags" sm={firstColumnWidth}>Tags</Label>
														<Col sm={secondColumnWidth}>
															<Input type="text" name="tags" id="navbar-tags" onChange={(e: React.ChangeEvent<HTMLInputElement>) => this.setState({ ...this.state, recipeForm: { ...this.state.recipeForm, tags: e.target.value } })} />
														</Col>
													</FormGroup> */}
													{/* <FormGroup row>
														<Label for="images" sm={firstColumnWidth}>Upload image</Label>
														<Col sm={secondColumnWidth}>
															<CustomInput type="file" id="navbar-images" name="file" onChange={(e: React.ChangeEvent<HTMLInputElement>) => this.setState({ ...this.state, recipeForm: { ...this.state.recipeForm, image: e.target.value } })} />
														</Col>
													</FormGroup> */}
													<hr />
													<Button type="submit" className="float-right">Submit</Button>
													<Button className="float-right" onClick={(e: React.MouseEvent<HTMLButtonElement>) => this.setState({ ...this.state, recipeModal: !this.state.recipeModal })}>Cancel</Button>
												</Form>
											</ModalBody>
										</Modal>
									</div>
								);
							}}
						</ApolloConsumer>
					);
				}}
			</UserContext.Consumer>
		);
	}
}
