import React from "react";
import Recipe from "../entities/Recipe";
import RecipeSummary from "./RecipeSummary";

interface IRecipeSummariesProps {
	recipes: Partial<Recipe>[];
}

export default class RecipeSummaries extends React.Component<IRecipeSummariesProps> {
	public render(): JSX.Element {
		return (
			<div>
				<ul>
					{this.props.recipes.map((recipe, i) => {
						<li key={i}>
							<RecipeSummary
								id={recipe.id as number}
								name={recipe.name as string}
								description={recipe.description as string}
								imagePath={recipe.imagePath}
								timesFavorited={recipe.timesFavorited || 0}
							/>
						</li>;
					})}
				</ul>
			</div>
		);
	}
}
