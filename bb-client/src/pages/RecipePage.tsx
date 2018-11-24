// tslint:disable: no-unsafe-any
import React from "react";
import MediaQuery from "react-responsive";
import { RouteComponentProps } from "react-router-dom";
import { UserContext } from "../App";
import HostSummaryContainer from "../containers/HostSummaryContainer";
import RecipeDetailsContainer from "../containers/RecipeDetailsContainer";
import RecipeHeaderContainer from "../containers/RecipeHeaderContainer";
import Recipe from "../entities/Recipe";
import "./resources/css/RecipePage.css";

interface IRecipePageParams {
	recipeID: string;
}

interface IRecipePageState {
	recipe: Partial<Recipe>;
}

export default class RecipePage extends React.Component<RouteComponentProps<IRecipePageParams>, IRecipePageState> {
	constructor(props: RouteComponentProps<IRecipePageParams>) {
		super(props);

		this.fetchRecipeFromParams = this.fetchRecipeFromParams.bind(this);
		this.getRecipeReviewAverage = this.getRecipeReviewAverage.bind(this);

		this.state = {
			recipe: this.fetchRecipeFromParams(),
		};
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
			timesSaved: 10,
			reviews: [
				{
					id: 1,
					description: "It was ok. Not the best I've ever had.",
					rating: 3,
				},
				{
					id: 2,
					description: "The French Laundry has been on my bucket list since I first saw it in Yountville in 2013. I was thrilled that our son was able to get reservations for the day we would be visiting in October, which happened to fall around our wedding anniversary. The evening was made even more special because we shared it with my son and his girl friend, and it was his treat!\nWe were greeted by name and wished a happy anniversary as soon as we entered. Our menus were personalized with \"Happy Anniversary John and Nancy.\" The service was impeccable. Even though the portions were small, we had at least 10 courses. By the end of the meal, I had trouble finishing. I can't say that every course was a favorite, but I loved the presentation and the different textures and flavors. Actually, one of my favorite courses was the \"Bread and Butter\" course, a bitter cocoa laminated brioche with Diane St. Clair's Animal Farm Butter. The brioche was in the shape of a seashell and just melted in my mouth! I was surprised by the number of beautiful desserts that we each got. After dinner we were given a tour of the kitchen, which I wasn't expecting, and we were sent home with our menus signed by Thomas Keller and small tins of cookies. The only thing that could have made the evening more perfect would have been if Thomas Keller had been there that evening.",
					rating: 5,
				},
			],
			allergies: [
				{
					id: 1,
					name: "Peanuts",
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
		/**
		 *  NOTE: If the current user isn't the recipe creator,
		 * the edit button should be a copy and edit instead
		 * (this should call the api to make a new meal off this one (with the user as the author),
		 * and then link to that meal's page).
		 *
		 * Maybe allow any user to edit if the ingredient list is empty
		 */

		return (
			<UserContext.Consumer>
				{userContext => {
					return (
						<div>
							<MediaQuery query="(max-width: 949px)">
								<div>
									<div>
									</div>
								</div>
							</MediaQuery>

							<MediaQuery query="(min-width: 950px)">
								<div id="Article">
									<div className="card">
										<div id="recipe-header">
											<RecipeHeaderContainer
												name={this.state.recipe.name as string}
												description={this.state.recipe.description}
												tagList={this.state.recipe.tags || []}
												createdAt={this.state.recipe.createdAt as Date}
												reviewAverage={this.getRecipeReviewAverage()}
												timesFavorited={this.state.recipe.timesSaved as number}
												allergies={this.state.recipe.allergies || []}
											/>
										</div>
									</div>
									<div className="card">
										<div id="recipe-under">
											<RecipeDetailsContainer
												reviews={this.state.recipe.reviews || []}
											/>
										</div>
									</div>
								</div>
								<div id="ArticleRight">
									<HostSummaryContainer
										id={1}
										name={`${"Jonathan"} ${"Wang"}`}
										about={"Yeet"}
										imagePath={undefined}
										topics={[]}
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
