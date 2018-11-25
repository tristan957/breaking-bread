// tslint:disable: no-unsafe-any
import React from "react";
import MediaQuery from "react-responsive";
import { RouteComponentProps } from "react-router-dom";
import { UserContext } from "../App";
import HostSummaryContainer from "../containers/HostSummaryContainer";
import RecipeHeaderContainer from "../containers/RecipeHeaderContainer";
import RecipeReviewsContainer from "../containers/RecipeReviewsContainer";
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
			description: "Ropa vieja (Spanish pronunciation: [ˈro.pa ˈβje.xa]; \"old clothes\") is one of the national dishes of Cuba, but is also popular in other areas or parts of the Caribbean such as Puerto Rico and Panama and even in the Philippines. It consists of shredded or pulled stewed beef with vegetables. In the Cuban cuisine of Miami, Florida, it is typical for Ropa Vieja to have a sweet undertone. While this is traditionally intended to be due to the use of fully ripe, red bell peppers, it is not uncommon for recipes to include some quantity of sugar as a means to achieve the correct level of sweetness in the finished dish.",
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
			createdAt: new Date("November 18, 2018 22:00:00").valueOf(),
			timesSaved: 10,
			reviews: [
				{
					id: 1,
					description: "It was ok. Not the best I've ever had.",
					rating: 3,
					author: {
						firstName: "Greg",
						lastName: "Noonan",
					},
				},
				{
					id: 2,
					description: "The French Laundry has been on my bucket list since I first saw it in Yountville in 2013. I was thrilled that our son was able to get reservations for the day we would be visiting in October, which happened to fall around our wedding anniversary. The evening was made even more special because we shared it with my son and his girl friend, and it was his treat!\nWe were greeted by name and wished a happy anniversary as soon as we entered. Our menus were personalized with \"Happy Anniversary John and Nancy.\" The service was impeccable. Even though the portions were small, we had at least 10 courses. By the end of the meal, I had trouble finishing. I can't say that every course was a favorite, but I loved the presentation and the different textures and flavors. Actually, one of my favorite courses was the \"Bread and Butter\" course, a bitter cocoa laminated brioche with Diane St. Clair's Animal Farm Butter. The brioche was in the shape of a seashell and just melted in my mouth! I was surprised by the number of beautiful desserts that we each got. After dinner we were given a tour of the kitchen, which I wasn't expecting, and we were sent home with our menus signed by Thomas Keller and small tins of cookies. The only thing that could have made the evening more perfect would have been if Thomas Keller had been there that evening.",
					rating: 5,
					author: {
						firstName: "Jonathan",
						lastName: "Wang",
					},
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
								<div id="article">
									<div id="article-left">
										<div className="card">
											<RecipeHeaderContainer
												name={this.state.recipe.name!}
												tagList={this.state.recipe.tags || []}
												createdAt={this.state.recipe.createdAt!}
												reviewAverage={this.getRecipeReviewAverage()}
												timesFavorited={this.state.recipe.timesSaved!}
												allergies={this.state.recipe.allergies || []}
											/>
										</div>
										<div id="recipe-description" className="card">
											<h3>Description</h3>
											<hr />
											<p>{this.state.recipe.description}</p>
										</div>
										<div id="recipe-reviews">
											<RecipeReviewsContainer
												reviews={this.state.recipe.reviews || []}
											/>
										</div>
									</div>
									<div id="article-right">
										<HostSummaryContainer
											id={1}
											name={`${"Jonathan"} ${"Wang"}`}
											about={"Yeet"}
											imagePath={undefined}
											topics={[]}
										/>
									</div>
								</div>
							</MediaQuery>
						</div>
					);
				}}
			</UserContext.Consumer>
		);
	}
}
