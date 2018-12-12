import gql from "graphql-tag";
import React from "react";
import { Query, QueryResult } from "react-apollo";
import { RouteComponentProps } from "react-router-dom";
import { Markdown } from "react-showdown";
import { UserContext } from "../App";
import CreatorSummary from "../components/CreatorSummary";
import RecipeReviewsContainer from "../containers/RecipeReviewsContainer";
import RecipeSummaryContainer from "../containers/RecipeSummaryContainer";
import Recipe from "../entities/Recipe";
import "./resources/css/RecipePage.css";

const RECIPE = gql`
	query Recipe($recipeID: Int!) {
		recipe(id: $recipeID) {
			id
			author {
				id
			}
			description
		}
	}
`;

interface IRecipeData {
	recipe?: Partial<Recipe>;
}

interface IRecipeVariables {
	recipeID: number;
}

type RecipeResult = QueryResult<IRecipeData, IRecipeVariables>;

interface IRecipePageParams {
	recipeID: string;
}

export default class RecipePage extends React.Component<RouteComponentProps<IRecipePageParams>> {
	public render(): JSX.Element {
		/**
		 *  NOTE: If the current user isn't the recipe creator,
		 * the edit button should be a copy and edit instead
		 * (this should call the api to make a new meal off this one (with the user as the author),
		 * and then link to that meal's page).
		 *
		 * Maybe allow any user to edit if the ingredient list is empty
		 */

		const recipeID = parseInt(this.props.match.params.recipeID, 10);

		return (
			<UserContext.Consumer>
				{userContext => {
					return (
						<Query query={RECIPE} variables={{ recipeID }}>
							{(result: RecipeResult) => {
								if (result.loading) { return <div></div>; }
								if (result.error) {
									console.error(result.error);
									return <div>{result.error}</div>;
								}
								if (result.data!.recipe === undefined) {
									return <div>What do in this case</div>;
								}

								return (
									<div id="recipe-page">
										<div id="recipe-page-left">
											<RecipeSummaryContainer recipeID={recipeID} viewerID={userContext.userID} />
											<div id="recipe-page-description" className="card">
												<h3>Description</h3>
												<hr />
												<div>{<Markdown markup={result.data!.recipe!.description} />}</div>
											</div>
											<div id="recipe-page-reviews">
												<RecipeReviewsContainer recipeID={recipeID} />
											</div>
										</div>
										<div id="recipe-page-right">
											<div className="card">
												<CreatorSummary
													userID={result.data!.recipe!.author!.id!}
													viewerID={userContext.userID}
												/>
											</div>
										</div>
									</div>
								);
							}}
						</Query>
					);
				}}
			</UserContext.Consumer>
		);
	}
}
