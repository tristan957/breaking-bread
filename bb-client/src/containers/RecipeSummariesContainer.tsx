// tslint:disable: no-unsafe-any
import React from "react";
import RecipeSummaries from "../components/RecipeSummaries";
import Recipe from "../entities/Recipe";

interface IRecipesContainerProps {
	recipes: Partial<Recipe>[];
}

export default class RecipesContainer extends React.Component<IRecipesContainerProps> {
	public render(): JSX.Element {
		return (
			<div>
				<h4>Recipes</h4>
				<RecipeSummaries {...this.props} />
				{/* <ul className="list">
					{this.props.recipes.map((recipe, i) => {
						return (
							<li className="recipe" key={i}>
								<RecipeSummary
									id={recipe.id as number}
									name={recipe.name as string}
									description={recipe.description as string}
									imagePath={recipe.imagePath}
									timesFavorited={recipe.timesFavorited as number}
								/>
							</li>
						);
					})}
				</ul> */}
			</div>
		);
	}
}
