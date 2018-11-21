// tslint:disable: no-unsafe-any
import React from "react";
import RecipeSummaries from "../components/RecipeSummaries";
import Recipe from "../entities/Recipe";

interface IRecipeSummariesContainerProps {
	recipes: Partial<Recipe>[];
}

export default class RecipeSummariesContainer extends React.Component<IRecipeSummariesContainerProps> {
	public render(): JSX.Element {
		return (
			<div>
				<h4>Recipes</h4>
				<RecipeSummaries {...this.props} />
			</div>
		);
	}
}
