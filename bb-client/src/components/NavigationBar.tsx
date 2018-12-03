import gql from "graphql-tag";
import moment from "moment";
import React from "react";
import { Query, QueryResult } from "react-apollo";
import "react-dates/initialize";
import ReactMde from "react-mde";
import "react-mde/lib/styles/css/react-mde-all.css";
import { Button, Col, CustomInput, Dropdown, DropdownItem, DropdownMenu, DropdownToggle, Form, FormFeedback, FormGroup, FormText, Input, InputGroup, Label, Modal, ModalBody, ModalHeader, Nav, Navbar, NavbarBrand } from "reactstrap";
import Showdown from "showdown";
import User from "../entities/User";
import GeoSuggest from "./GeoSuggest";
import "./resources/css/NavigationBar.css";
import { default as logo } from "./resources/images/icon.png";

const USER_RECIPES = gql`
	query UserRecipes($userID: Int!) {
		user(id: $userID) {
			id
			savedRecipes {
				id
				name
			}
		}
	}
`;

interface IUserRecipesData {
	user?: Partial<User>;
}

interface IUserRecipesVariables {
	userID: number;
}

type UserRecipesResult = QueryResult<IUserRecipesData, IUserRecipesVariables>;

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
	tags?: string;
	image?: string;
};

interface INavigationBarState {
	createdAt: moment.Moment | null;
	calendarFocused: boolean;
	dropDown: boolean;
	mealModal: boolean;
	recipeModal: boolean;
	mealForm: MealForm;
	recipeForm: RecipeForm;
}

export default class NavigationBar extends React.Component<{}, INavigationBarState> {
	public converter: Showdown.Converter;

	constructor(props: Readonly<{}>) {
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

	public render(): JSX.Element {
		const firstColumnWidth = 3;
		const secondColumnWidth = 12 - firstColumnWidth;

		return (
			<div id="navbar">
				<Navbar color="light" light expand="md">
					<NavbarBrand href="/" className="bb-navbar-brand">
						<div id="bb-brand-container"><img id="bb-brand" src={logo} height={30} /></div>
					</NavbarBrand>
					<Nav className="ml-auto" navbar>
						<Dropdown isOpen={this.state.dropDown} toggle={this.toggleDropDown}>
							<DropdownToggle>+</DropdownToggle>
							<DropdownMenu>
								<DropdownItem onClick={this.toggleMealModal}>New Meal</DropdownItem>
								<DropdownItem divider />
								<DropdownItem onClick={this.toggleRecipeModal}>New Receipe</DropdownItem>
							</DropdownMenu>
						</Dropdown>
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
							<Query query={USER_RECIPES} variables={{ userID: 2 }}>
								{(result: UserRecipesResult) => {
									if (result.loading) { return <div></div>; }
									if (result.error) {
										console.error(result.error);
										return <div>{result.error.message}</div>;
									}

									return (
										<FormGroup>
											<Label for="recipes">Select Recipes</Label>
											<Input type="select" name="recipes" id="navbar-recipes" multiple onChange={(e: React.ChangeEvent<HTMLInputElement>) => console.log(e.target.value)}>
												{result.data!.user!.savedRecipes!.map((recipe, i) => {
													return <option key={i}>{recipe.id} -- {recipe.name}</option>;
												})}
											</Input>
										</FormGroup>
									);
								}}
							</Query>
							<hr />
							<Button type="submit" className="float-right">Submit</Button>
							<Button className="float-right" onClick={(e: React.MouseEvent<HTMLButtonElement>) => this.setState({ ...this.state, mealModal: !this.state.mealModal })}>Cancel</Button>
						</Form>
					</ModalBody>
				</Modal>

				{/* RECIPE MODAL */}
				<Modal size={"lg"} centered={true} isOpen={this.state.recipeModal} toggle={this.toggleRecipeModal}>
					<ModalHeader toggle={this.toggleRecipeModal}>New Recipe</ModalHeader>
					<ModalBody>
						<Form>
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
								<Label for="tags" sm={firstColumnWidth}>Tags</Label>
								<Col sm={secondColumnWidth}>
									<Input type="text" name="tags" id="navbar-tags" onChange={(e: React.ChangeEvent<HTMLInputElement>) => this.setState({ ...this.state, recipeForm: { ...this.state.recipeForm, tags: e.target.value } })} />
								</Col>
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
						</Form>
					</ModalBody>
				</Modal>
			</div>
		);
	}
}
