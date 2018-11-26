import React from "react";
import { RouteComponentProps } from "react-router-dom";
import { Markdown } from "react-showdown";
import CreatorSummary from "../components/CreatorSummary";
import RecipeReviewsContainer from "../containers/RecipeReviewsContainer";
import RecipeSummaryContainer from "../containers/RecipeSummaryContainer";
import Recipe from "../entities/Recipe";
import "./resources/css/RecipePage.css";

const GET_RECIPE = `
	query GetRecipe($id: Int!) {
		getRecipe(input: {id: $id}) {
			id
			name
			description
			tags {
				id
				name
			}
			createdAt
			timesSaved
			reviews {
				id
				description
				rating
				author {
					id
					firstName
					lastName
				}
			}
			allergies {
				id
				name
			}
			author {
				id
			}
		}
	}
`;

interface IRecipePageParams {
	recipeID: string;
}

interface IRecipePageState {
	recipe: Partial<Recipe>;
}

export default class RecipePage extends React.Component<RouteComponentProps<IRecipePageParams>, IRecipePageState> {
	constructor(props: RouteComponentProps<IRecipePageParams>) {
		super(props);

		this.state = {
			recipe: this.fetchRecipeFromParams(),
		};
	}

	private fetchRecipeFromParams = (): Partial<Recipe> => {
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

	// public UNSAFE_componentWillMount(): void {
	// 	const data = `{ "query": "${GET_RECIPE}", "variables": ${JSON.stringify({ id: this.props.match.params.recipeID })} }}`;
	// 	console.log(data);
	// 	axios.request({
	// 		method: "POST",
	// 		url: uri,
	// 		data,
	// 		headers: {
	// 			"Content-Type": "application/json",
	// 			"oAuthSub": "adjijdfaa",
	// 		},
	// 	}).then(res => {
	// 		console.log(res);
	// 	}).catch(err => {
	// 		console.log(err);
	// 	});
	// }

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
			<div id="recipe-page">
				<div id="recipe-page-left">
					<RecipeSummaryContainer recipe={this.state.recipe} />
					<div id="recipe-page-description" className="card">
						<h3>Description</h3>
						<hr />
						<p>{<Markdown markup={this.state.recipe.description} />}</p>
					</div>
					<div id="recipe-page-reviews">
						<RecipeReviewsContainer
							reviews={this.state.recipe.reviews || []}
						/>
					</div>
				</div>
				<div id="recipe-page-right">
					<div className="card">
						<CreatorSummary
							id={1}
							name={`${"Jonathan"} ${"Wang"}`}
							imagePath={undefined}
							topics={[{ name: "Your mom" }, { name: "Your Dad" }]}
						/>
					</div>
				</div>
			</div>
		);
	}
}
