import React from "react";
import { UserContext } from "../App";
import RecipeSummary from "../components/RecipeSummary";
import Recipe from "../entities/Recipe";

interface IRecipeSummaryContainerProps {
	showAuthor?: boolean;
	recipe: Partial<Recipe>;
}

export default class RecipeSummaryContainer extends React.Component<IRecipeSummaryContainerProps> {
	private getRecipeReviewAverage = (): number => { // TODO: deduplicate
		if (this.props.recipe.reviews === undefined || this.props.recipe.reviews.length === 0) {
			return 0;
		}

		let sum = 0;
		let effectiveLength = 0;
		this.props.recipe.reviews.forEach(element => {
			if (element.rating !== undefined) {
				sum += element.rating;
				effectiveLength += 1;
			}
		});

		return sum / effectiveLength;
	}

	public render(): JSX.Element {
		return (
			<UserContext.Consumer>
				{userContext => {
					return (
						<div className="card">
							<RecipeSummary
								authorID={this.props.recipe.author!.id!}
								viewerID={userContext.user!.id}
								name={this.props.recipe.name!}
								tags={this.props.recipe.tags || []}
								createdAt={this.props.recipe.createdAt!}
								updatedAt={this.props.recipe.updatedAt!}
								reviewAverage={this.getRecipeReviewAverage()}
								timesSaved={this.props.recipe.timesSaved || 0}
								allergies={this.props.recipe.allergies || []}
							/>
						</div>
					);
				}}
			</UserContext.Consumer>
		);
	}
}
