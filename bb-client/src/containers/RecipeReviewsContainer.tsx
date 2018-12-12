import gql from "graphql-tag";
import React from "react";
import { Query, QueryResult } from "react-apollo";
import { RecipeReviews } from "../components/RecipeReviews";
import Recipe from "../entities/Recipe";
import "./resources/css/ProfileActivityContainer.css";
import "./resources/css/RecipeDetailsContainer.css";

const RECIPE_REVIEWS = gql`
	query RecipeReviews($recipeID: Int!) {
		recipe(id: $recipeID) {
			id
			reviews {
				id
				rating
				description
				author {
					id
					name
				}
			}
		}
	}
`;

interface IRecipeReviewsData {
	recipe: Partial<Recipe>;
}

interface IRecipeReviewsVariables {
	recipeID: number;
}

type RecipeReviewsResult = QueryResult<IRecipeReviewsData, IRecipeReviewsVariables>;

interface IRecipeReviewsContainerProps {
	recipeID: number;
}

export default class RecipeReviewsContainer extends React.Component<IRecipeReviewsContainerProps> {
	public render(): JSX.Element {
		return (
			<Query query={RECIPE_REVIEWS} variables={{ recipeID: this.props.recipeID }}>
				{(result: RecipeReviewsResult) => {
					if (result.loading) { return <div></div>; }
					if (result.error) {
						console.error(result.error);
						return <div>{result.error.message}</div>;
					}

					return (
						<div id="recipe-details-container" className="card">
							<h3>Reviews</h3>
							<RecipeReviews reviews={result.data!.recipe.reviews || []} />
						</div>
					);
				}}
			</Query>
		);
	}
}
