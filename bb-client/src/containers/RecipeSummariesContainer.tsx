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
			</div>
		);
	}
}
