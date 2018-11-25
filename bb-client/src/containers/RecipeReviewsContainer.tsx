import React from "react";
import { RecipeReviews } from "../components/RecipeReviews";
import RecipeReview from "../entities/RecipeReview";
import "./resources/css/ProfileActivityContainer.css";
import "./resources/css/RecipeDetailsContainer.css";

interface IRecipeDetailsContainerProps {
	reviews: Partial<RecipeReview>[];
}

export default class RecipeDetailsContainer extends React.Component<IRecipeDetailsContainerProps> {
	public render(): JSX.Element {
		return (
			<div id="recipe-details-container" className="card">
				<h3>Reviews</h3>
				<RecipeReviews reviews={this.props.reviews} />
			</div>
		);
	}
}
