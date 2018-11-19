import React from "react";
import { Button, ButtonGroup } from "reactstrap";
import Ingredient from "../entities/Ingredient";
import RecipeReview from "../entities/RecipeReview";
import "./resources/css/ProfileActivityContainer.css";

enum RenderSide {
	Ingredients,
	Reviews,
}

interface IRecipeDetailsContainerProps {
	reviews: Partial<RecipeReview>[];
	ingredients: Partial<Ingredient>[];
}

interface IRecipeDetailsContainerState {
	render: RenderSide;
}

export default class RecipeDetailsContainer extends React.Component<IRecipeDetailsContainerProps, IRecipeDetailsContainerState> {
	constructor(props: IRecipeDetailsContainerProps) {
		super(props);

		this.state = {
			render: RenderSide.Ingredients,
		};
		this.changeRender = this.changeRender.bind(this);
	}

	private changeRender(newRender: RenderSide): void {
		this.setState({
			render: newRender,
		});
	}

	private renderDetails(): JSX.Element | undefined {
		switch (this.state.render) {
			case RenderSide.Ingredients: {
				if (this.props.ingredients.length > 0) {
					return (
						<div>
							<div className="container-header">Ingredients</div>
							<hr className="seperator" />
						</div>
					);
				} else {
					return (
						<div>
							<div className="container-header">Ingredients</div>
							<hr className="seperator" />
							😲 The creator failed to add ingredients. Feel free to edit the recipe to add ingredients.
							{/* Assuming we are allowing anyone to edit a meal when not ingredients are listed */}
						</div>
					);
				}
			}
			case RenderSide.Reviews: {
				if (this.props.reviews.length > 0) {
					return (
						<div>
							<div className="container-header">Reviews</div>
							<hr className="seperator" />
						</div>
					);
				} else {
					return (
						<div>
							<div className="container-header">Reviews</div>
							<hr className="seperator" />
							This recipe is fresh! If you've been to a meal with this recipe, feel free to add a review.
						</div>
					);
				}

				// TODO: Check if user has a meal with this recipe in their attending meals past before displaying review container
			}
			default: {
				return undefined;
			}
		}
	}

	public render(): JSX.Element {
		return (
			<div id="recipe-details-container" className="recipe-details-container-class">
				<div>
					<ButtonGroup>
						<Button className="show-filter-modal" active={this.state.render === 0} onClick={() => this.changeRender(RenderSide.Ingredients)}>Ingredients</Button>
						<Button className="show-filter-modal" active={this.state.render === 1} onClick={() => this.changeRender(RenderSide.Reviews)}>Reviews</Button>
					</ButtonGroup>
				</div>
				<div>
					{this.renderDetails()}
				</div>
			</div>
		);
	}
}
