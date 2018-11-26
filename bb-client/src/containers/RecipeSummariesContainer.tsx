import React from "react";
import Recipe from "../entities/Recipe";
import RecipeSummaryContainer from "./RecipeSummaryContainer";

interface IRecipeSummariesContainerProps {
	recipes: Partial<Recipe>[];
	showAuthor?: boolean;
}

export default class RecipeSummariesContainer extends React.Component<IRecipeSummariesContainerProps> {
	public render(): JSX.Element {
		return (
			<div>
				<ul className="no-style-list">
					{this.props.recipes.map((recipe, i) => {
						return (
							<li key={i}>
								<hr className="recipe-summary-seperator" />
								<RecipeSummaryContainer recipe={recipe} showAuthor={this.props.showAuthor} />
							</li>
						);
					})}
				</ul>
			</div>
		);
	}
}
