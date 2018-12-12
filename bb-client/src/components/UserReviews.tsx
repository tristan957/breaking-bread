import React from "react";
import { Badge } from "reactstrap";
import UserReview from "../entities/UserReview";
import "./resources/css/UserReviews.css";

interface IUserReviewsProps {
	reviews: Partial<UserReview>[];
}

export class UserReviews extends React.Component<IUserReviewsProps> {
	public render(): JSX.Element {
		return (
			<div>
				<ul className="no-style-list">
					{this.props.reviews.map((review, i) => {
						return (
							<li key={i}>
								<hr />
								<div id="user-review-container">
									<div id="user-review-rating-author-container">
										<div>
											<Badge color="primary">
												⭐ {review.rating}/5
											</Badge>
										</div>
										<span id="user-review-author-name">{review.author!.name}</span>
									</div>
									<div>
										<p id="user-review-description">{review.description}</p>
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
