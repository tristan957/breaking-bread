// tslint:disable: no-unsafe-any
import React from "react";
import MediaQuery from "react-responsive";
import { RouteComponentProps } from "react-router-dom";
import { UserContext } from "../App";
import RecipeHeader from "../containers/RecipeHeaderContainer";
import Recipe from "../entities/Recipe";

interface IRecipePageParams {
	recipeID: string;
}

interface IRecipePageState {
	userLoggedIn?: Partial<Recipe>;
	recipe: Partial<Recipe>;
}

export default class RecipePage extends React.Component<RouteComponentProps<IRecipePageParams>, IRecipePageState> {
	constructor(props: RouteComponentProps<IRecipePageParams>) {
		super(props);

		this.fetchRecipeFromParams = this.fetchRecipeFromParams.bind(this);
		this.getRecipeReviewAverage = this.getRecipeReviewAverage.bind(this);
	}

	private fetchRecipeFromParams(): Partial<Recipe> {
		const tempRecipe: Partial<Recipe> = {
			id: 2,
			name: "Ropa vieja",
			description: "A classic and a national dish of Cuba",
			tags: [
				{
					id: 1,
					name: "Cuban",
				},
				{
					id: 2,
					name: "Chicken",
				},
			],
			createdAt: new Date("November 18, 2018 22:00:00"),
			timesFavorited: 10,
			reviews: [
				{
					id: 1,
					rating: 3,
				},
				{
					id: 2,
					rating: 5,
				},
			],
		};

		const recipeID: number = parseInt(this.props.match.params.recipeID, 10);

		return tempRecipe;
	}

	private getRecipeReviewAverage(): number {
		if (this.state.recipe.reviews === undefined || this.state.recipe.reviews.length === 0) {
			return 0;
		}

		let sum = 0;
		let effectiveLength = 0;
		this.state.recipe.reviews.forEach(element => {
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
					this.state = {
						userLoggedIn: userContext.user,
						recipe: this.fetchRecipeFromParams(),
					};

					return (
						<div>
							<MediaQuery query="(max-width: 949px)">
								<div>
									<div>
									</div>
								</div>
							</MediaQuery>

							<MediaQuery query="(min-width: 950px)">
								<div id="recipe-header">
									<RecipeHeader
										name={this.state.recipe.name as string}
										description={this.state.recipe.description}
										tagList={this.state.recipe.tags || []}
										createdAt={this.state.recipe.createdAt as Date}
										reviewAverage={this.getRecipeReviewAverage()}
									/>
								</div>
							</MediaQuery>
						</div>
					);
				}}
			</UserContext.Consumer>
		);
	}
}
