import gql from "graphql-tag";
import React from "react";
import { Mutation, MutationFn, MutationResult } from "react-apollo";
import { Link } from "react-router-dom";
import { Badge, Button, Col, Form, FormGroup, Input, InputGroup, InputGroupAddon, Label, Modal, ModalBody, ModalHeader } from "reactstrap";
import Allergy from "../entities/Allergy";
import RecipeReview from "../entities/RecipeReview";
import Tag from "../entities/Tag";
import ItemTags from "./ItemTags";
import "./resources/css/RecipeSummary.css";
import { default as defaultMealPic } from "./resources/images/default_meal_pic.jpg";

const RECIPE_REVIEW_SAVE = gql`
	mutation RecipeReviewSave($input: RecipeReviewSaveInput!) {
		recipeReviewSave(input: $input) {
			id
		}
	}
`;

interface IRecipeReviewSaveData {
	recipeReviewSave: Partial<RecipeReview>;
}

interface IRecipeReviewSaveVariables {
	input: {
		subjectID: number;
		rating: number;
		description: string;
	};
}

type RecipeReviewSaveResult = MutationResult<IRecipeReviewSaveData>;
type RecipeReviewSaveFn = MutationFn<IRecipeReviewSaveData, IRecipeReviewSaveVariables>;

const RECIPE_REVIEW_EDIT = gql`
	mutation RecipeReviewEdit($input: RecipeReviewEditInput!) {
		recipeReviewEdit(input: $input) {
			id
		}
	}
`;

interface IRecipeReviewEditData {
	recipeReviewEdit: Partial<RecipeReview>;
}

interface IRecipeReviewEditVariables {
	input: {
		id: number;
		rating: number;
		description: string;
	};
}

type RecipeReviewEditResult = MutationResult<IRecipeReviewEditData>;
type RecipeReviewEditFn = MutationFn<IRecipeReviewEditData, IRecipeReviewEditVariables>;

interface IRecipeSummaryProps {
	recipeID: number;
	authorID: number;
	viewerID?: number;
	name: string;
	reviews: Partial<RecipeReview>[];
	tags: Partial<Tag>[];
	imagePath?: string | null; // TODO: get rid of null
	createdAt: number;
	updatedAt: number;
	reviewAverage: number;
	timesSaved: number;
	allergies: Partial<Allergy>[];
	showAuthor?: boolean;
	reload(): void;
}

interface IRecipeSummaryState {
	modalOpen: boolean;
	rating?: string;
	description?: string;
}

export default class RecipeSummary extends React.Component<IRecipeSummaryProps, IRecipeSummaryState> {
	constructor(props: IRecipeSummaryProps) {
		super(props);

		this.state = {
			modalOpen: false,
		};
	}

	private toggle = () => {
		this.setState({
			modalOpen: !this.state.modalOpen,
		});
	}

	public render(): JSX.Element {
		let userReview: Partial<RecipeReview> | undefined = undefined;
		const hasReview = this.props.reviews.some(review => {
			if (review.author!.id === this.props.viewerID && this.props.viewerID !== undefined) {
				userReview = review;
				return true;
			}

			return false;
		});

		return (
			<div id="recipe-summary">
				<img src={this.props.imagePath || defaultMealPic} id="recipe-summary-img" alt="Recipe Picture" />
				<div id="recipe-summary-information">
					<div id="recipe-summary-left">
						<Link to={`/r/${this.props.recipeID}`} className="black-link-with-underline">
							<div id="recipe-summary-name">{this.props.name}</div>
						</Link>
						<span className="recipe-summary-updated">Last updated on
							{` ${new Date(this.props.updatedAt).toLocaleDateString()}`}
						</span>
						<div id="recipe-summary-badges">
							<Badge className="recipe-summary-badge-item" color="primary">
								⭐ {parseFloat(this.props.reviewAverage.toFixed(2))}/5
							</Badge>
							<Badge className="recipe-summary-badge-item" color="primary">
								❤️ {this.props.timesSaved}
							</Badge>
						</div>
						<div id="recipe-summary-buttons">
							{this.props.authorID === this.props.viewerID || this.props.viewerID === undefined
								? <Button disabled outline color="secondary" className="recipe-summary-action">Review</Button>
								: <Button outline color="secondary" className="recipe-summary-action" onClick={this.toggle}>{hasReview ? "Edit Review" : "Review"}</Button>
							}
							{hasReview
								? (
									<Mutation mutation={RECIPE_REVIEW_EDIT} onCompleted={() => this.props.reload()}>
										{(recipeReviewEdit: RecipeReviewEditFn, result: RecipeReviewEditResult) => {
											if (result.error) {
												console.error(result.error);
												return <div>{result.error.message}</div>;
											}

											return (
												<Modal isOpen={this.state.modalOpen} toggle={this.toggle}>
													<ModalHeader toggle={this.toggle}>Review Editor</ModalHeader>
													<ModalBody>
														<Form onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
															recipeReviewEdit({
																variables: {
																	input: {
																		id: userReview!.id!,
																		rating: parseInt(this.state.rating || userReview!.rating!.toString(), 10),
																		description: this.state.description!,
																	},
																},
															});
															this.toggle();
															e.preventDefault();
														}}>
															<FormGroup row>
																<Label for="rating" sm={3}>Rating</Label>
																<Col sm={9}>
																	<InputGroup>
																		<Input type="number" step="1" max={5} min={0} defaultValue={userReview!.rating!.toString()} onChange={(e: React.ChangeEvent<HTMLInputElement>) => this.setState({ ...this.state, rating: e.target.value })} />
																		<InputGroupAddon addonType="append">/ 5</InputGroupAddon>
																	</InputGroup>
																</Col>
															</FormGroup>
															<FormGroup row>
																<Label for="description" sm={3}>Review</Label>
																<Col sm={9}>
																	<InputGroup>
																		<Input type="textarea" defaultValue={userReview!.description} onChange={(e: React.ChangeEvent<HTMLInputElement>) => this.setState({ ...this.state, description: e.target.value })} />
																	</InputGroup>
																</Col>
															</FormGroup>
															<Button className="float-right" style={{ marginBottom: 0 }} color="success" type="submit">Submit</Button>
															<Button className="float-right" style={{ marginRight: 5, marginBottom: 0 }} color="danger" onClick={this.toggle}>Cancel</Button>
														</Form>
													</ModalBody>
												</Modal>
											);
										}}
									</Mutation>
								) : (
									<Mutation mutation={RECIPE_REVIEW_SAVE} onCompleted={() => this.props.reload()}>
										{(recipeReviewSave: RecipeReviewSaveFn, result: RecipeReviewSaveResult) => {
											if (result.error) {
												console.error(result.error);
												return <div>{result.error.message}</div>;
											}

											return (
												<Modal isOpen={this.state.modalOpen} toggle={this.toggle}>
													<ModalHeader toggle={this.toggle}>Review Editor</ModalHeader>
													<ModalBody>
														<Form onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
															recipeReviewSave({
																variables: {
																	input: {
																		subjectID: this.props.recipeID,
																		rating: parseInt(this.state.rating!, 10),
																		description: this.state.description!,
																	},
																},
															});
															this.toggle();
															e.preventDefault();
														}}>
															<FormGroup row>
																<Label for="rating" sm={3}>Rating</Label>
																<Col sm={9}>
																	<InputGroup>
																		<Input type="number" step="1" max={5} min={0} onChange={(e: React.ChangeEvent<HTMLInputElement>) => this.setState({ ...this.state, rating: e.target.value })} />
																		<InputGroupAddon addonType="append">/ 5</InputGroupAddon>
																	</InputGroup>
																</Col>
															</FormGroup>
															<FormGroup row>
																<Label for="description" sm={3}>Review</Label>
																<Col sm={9}>
																	<InputGroup>
																		<Input type="textarea" onChange={(e: React.ChangeEvent<HTMLInputElement>) => this.setState({ ...this.state, description: e.target.value })} />
																	</InputGroup>
																</Col>
															</FormGroup>
															<Button className="float-right" style={{ marginBottom: 0 }} color="success" type="submit">Submit</Button>
															<Button className="float-right" style={{ marginRight: 5, marginBottom: 0 }} color="danger" onClick={this.toggle}>Cancel</Button>
														</Form>
													</ModalBody>
												</Modal>
											);
										}}
									</Mutation>
								)
							}
							<Button
								outline
								disabled={!(this.props.authorID !== this.props.viewerID && this.props.viewerID !== undefined)}
								color="secondary"
								className="recipe-summary-action"
							>
								Save
							</Button>
						</div>
					</div>
					<div id="recipe-summary-card-right">
						<div id="recipe-summary-tags">
							Tags
							<ItemTags color="info" names={this.props.tags.map(tag => `#${tag.name}`)} />
						</div>
						<div id="recipe-summary-allergies">
							Allergies
							<ItemTags color="warning" names={this.props.allergies.map(allergy => allergy.name)} />
						</div>
					</div>
				</div>
			</div>
		);
	}
}
