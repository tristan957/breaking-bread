// tslint:disable: no-unsafe-any
import React from "react";
import Recipe from "../../entities/Recipe";
import RecipeSummaryCard from "../cards/RecipeSummaryCard";

interface IRecipesContainerProps {
	recipes: Partial<Recipe>[];
}

export default class RecipesContainer extends React.Component<IRecipesContainerProps> {
	public render(): JSX.Element {
		return (
			<div>
				<h4>Recipes</h4>
				<ul className="list">
					{this.props.recipes.map((recipe, i) => {
						return (
							<li className="recipe" key={i}>
								<RecipeSummaryCard
									id={recipe.id as number}
									name={recipe.name as string}
									description={recipe.description as string}
									imagePath={recipe.imagePath}
									timesFavorited={recipe.timesFavorited as number}
								/>
							</li>
						);
					})}
				</ul>
			</div>
		);
	}
}
