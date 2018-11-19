import React from "react";
import RecipeReview from "../entities/RecipeReview";
import "./resources/css/ProfileActivityContainer.css";

interface IRecipeDetailsContainerProps {
	reviews: Partial<RecipeReview>[];
}

export default class RecipeDetailsContainer extends React.Component<IRecipeDetailsContainerProps> {
	constructor(props: IRecipeDetailsContainerProps) {
		super(props);

		this.renderReviews = this.renderReviews.bind(this);
		this.renderReviewContainer = this.renderReviewContainer.bind(this);
	}

	private renderReviews(): JSX.Element | undefined {
		if (this.props.reviews.length > 0) {
			return (
				<div>
					<div className="container-header">Reviews</div>
					<hr className="seperator" />
					{/* TODO: need Reviews list component */}
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
	}

	private renderReviewContainer(): JSX.Element | undefined {
		// TODO: Check if user has a meal with this recipe in their attending meals past before displaying review container
		return undefined;
		// NOTE: Could just be a modal
	}

	public render(): JSX.Element {
		return (
			<div id="recipe-details-container" className="recipe-details-container-class">
				<div>
					{this.renderReviews()}
					{this.renderReviewContainer()}
				</div>
			</div>
		);
	}
}
