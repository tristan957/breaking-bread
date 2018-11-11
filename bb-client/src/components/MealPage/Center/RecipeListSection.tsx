// tslint:disable: no-unsafe-any
import React from "react";
import Recipe from "../../../entities/Recipe";
import RecipeCard from "./RecipeCard";

interface IRecipeSectionProps {
	recipes: Partial<Recipe>[];
}

export default class RecipeListSection extends React.Component<IRecipeSectionProps> {
	public render(): JSX.Element {
		return (
			<div>
				<ul className="list">
					{this.props.recipes.map((recipe, i) => {
						return (
							<li className="recipe" key={i}>
								<RecipeCard
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
