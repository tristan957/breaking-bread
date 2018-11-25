import React from "react";
import RecipeSummary from "../components/RecipeSummary";
import Recipe from "../entities/Recipe";
import User from "../entities/User";

interface IRecipeSummaryContainerProps {
	showHost?: boolean;
	recipe: Partial<Recipe>;
}

export default class RecipeSummaryContainer extends React.Component<IRecipeSummaryContainerProps> {
	public render(): JSX.Element {
		return (
			<div className="card">
				<RecipeSummary
					id={this.props.recipe.id as number}
					author={this.props.recipe.author as Partial<User>}
					name={this.props.recipe.name as string}
					description={this.props.recipe.description as string}
					imagePath={this.props.recipe.imagePath}
					tags={this.props.recipe.tags || []}
					timesSaved={this.props.recipe.timesSaved || 0}
					showAuthor={this.props.showHost || false}
				/>
			</div>
		);
	}
}
