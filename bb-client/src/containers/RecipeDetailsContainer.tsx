import React from "react";
import Ingredient from "../entities/Ingredient";
import RecipeReview from "../entities/RecipeReview";
import "./resources/css/ProfileActivityContainer.css";

enum RenderSide {
	Reviews,
	Ingredients,
}

interface IRecipeDetailsContainerProps {
	reviews: Partial<RecipeReview>[];
	ingredients: Partial<Ingredient>[];
}

interface IRecipeDetailsContainerState {
	render: RenderSide;
}

export default class RecipeDetailsContainer extends React.Component<IRecipeDetailsContainerProps, IRecipeDetailsContainerState> {
	constructor(props: IRecipeDetailsContainerProps) {
		super(props);

		this.state = {
			render: RenderSide.Reviews,
		};
		this.changeRender = this.changeRender.bind(this);
	}

	private changeRender(newRender: RenderSide): void {
		this.setState({
			render: newRender,
		});
	}

	public render(): JSX.Element {
		return (
			<div>
				Hi
			</div>
		);
	}
}
