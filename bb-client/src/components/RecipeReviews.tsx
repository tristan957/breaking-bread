import React from "react";
import { Badge } from "reactstrap";
import RecipeReview from "../entities/RecipeReview";
import "./resources/css/RecipeReviews.css";

interface IRecipeReviewsProps {
	reviews: Partial<RecipeReview>[];
}

export class RecipeReviews extends React.Component<IRecipeReviewsProps> {
	public render(): JSX.Element {
		return (
			<div>
				<ul className="no-style-list">
					{this.props.reviews.map((review, i) => {
						return (
							<li key={i}>
								<hr />
								<div id="recipe-review-container">
									<div id="recipe-review-rating-author-container">
										<div>
											<Badge color="primary">
												⭐ {review.rating}/5
											</Badge>
										</div>
										<span id="recipe-review-author-name">{review.author!.firstName} {review.author!.lastName}</span>
									</div>
									<div>
										<p id="recipe-review-description">{review.description}</p>
									</div>
								</div>
							</li>
						);
					})}
				</ul>
			</div>
		);
	}
}
