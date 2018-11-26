import React from "react";
import { Badge, Button, Input, InputGroup, InputGroupAddon, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import Allergy from "../entities/Allergy";
import Tag from "../entities/Tag";
import User from "../entities/User";
import ItemTags from "./ItemTags";
import "./resources/css/RecipeSummary.css";
import { default as defaultMealPic } from "./resources/images/default_meal_pic.jpg";

interface IRecipeSummaryProps {
	recipeID: number;
	authorID: number;
	viewer?: Partial<User>;
	name: string;
	tags: Partial<Tag>[];
	imagePath?: string | null;
	createdAt: number;
	updatedAt: number;
	reviewAverage: number;
	timesSaved: number;
	allergies: Partial<Allergy>[];
	showAuthor?: boolean;
}

interface IRecipeSummaryState {
	modalOpen: boolean;
	reviewButtonText: "Edit Review" | "Review";
	recipeAlreadySaved: boolean;
}

export default class RecipeSummary extends React.Component<IRecipeSummaryProps, IRecipeSummaryState> {
	constructor(props: IRecipeSummaryProps) {
		super(props);

		this.state = {
			reviewButtonText: this.getUserAlreadyWroteReview(),
			modalOpen: false,
			recipeAlreadySaved: this.getRecipeAlreadySaved(),
		};
	}

	private getRecipeAlreadySaved = (): boolean => {
		// this.props.viewer!.savedRecipes!.forEach(recipe => {
		// 	if (this.props.recipeID === recipe.id) {
		// 		return true;
		// 	}
		// });

		return false;
	}

	private getUserAlreadyWroteReview = (): "Edit Review" | "Review" => {
		// this.props.viewer!.recipeReviewsAuthored!.forEach(review => {
		// 	if (review.subject!.id === this.props.recipeID) {
		// 		return "Edit Review";
		// 	}
		// });

		return "Review";
	}

	private toggle = () => {
		this.setState({
			modalOpen: !this.state.modalOpen,
		});
	}

	public render(): JSX.Element {
		return (
			<div id="recipe-summary">
				<img src={this.props.imagePath || defaultMealPic} id="recipe-summary-img" alt="Recipe Picture" />
				<div id="recipe-summary-information">
					<div id="recipe-summary-left">
						<h1 id="recipe-summary-name">
							{this.props.name}
						</h1>
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
							{this.props.authorID === this.props.viewer!.id && this.props.viewer !== undefined
								? undefined
								: <Button outline color="secondary" className="recipe-summary-action" onClick={this.toggle}>{this.state.reviewButtonText}</Button>
							}
							<Modal isOpen={this.state.modalOpen} toggle={this.toggle}>
								<ModalHeader toggle={this.toggle}>Review Editor</ModalHeader>
								<ModalBody>
									<InputGroup>
										<Input type="number" step="1" max={5} min={0} />
										<br />
										<InputGroupAddon addonType="append">/ 5</InputGroupAddon>
									</InputGroup>
									<Input type="textarea" />
								</ModalBody>
								<ModalFooter>
									<Button color="success" onClick={this.toggle}>Submit</Button>{" "}
									<Button color="danger" onClick={this.toggle}>Cancel</Button>
								</ModalFooter>
							</Modal>
							<Button outline color="secondary" className="recipe-summary-action">Save</Button>
						</div>
					</div>
					<div id="recipe-summary-card-right">
						<div id="recipe-summary-tags">
							Tags
							<ItemTags color="info" names={this.props.tags.map(tag => tag.name)} />
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
