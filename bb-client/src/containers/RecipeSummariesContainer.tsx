import gql from "graphql-tag";
import React from "react";
import { Query, QueryResult } from "react-apollo";
import User from "../entities/User";
import RecipeSummaryContainer from "./RecipeSummaryContainer";

const USER_AUTHORED_RECIPES = gql`
	query UserAuthoredRecipes($userID: Int!) {
		user(id: $userID) {
			id
			authoredRecipes {
				id
			}
		}
	}
`;

const USER_SAVED_RECIPES = gql`
	query UserSavedRecipes($userID: Int!) {
		user(id: $userID) {
			id
			savedRecipes {
				id
			}
		}
	}
`;

export enum RecipeType {
	AUTHORED,
	SAVED,
}

interface IRecipesData {
	user: Partial<User>;
}

interface IRecipesVariables {
	userID: number;
}

type RecipesResult = QueryResult<IRecipesData, IRecipesVariables>;

interface IRecipeSummariesContainerProps {
	userID: number;
}

interface IRecipeSummariesContainerProps {
	userID: number;
	type: RecipeType;
	showAuthor?: boolean;
}

export default class RecipeSummariesContainer extends React.Component<IRecipeSummariesContainerProps> {
	public render(): JSX.Element {
		return (
			<Query
				query={
					this.props.type === RecipeType.AUTHORED
						? USER_AUTHORED_RECIPES
						: USER_SAVED_RECIPES
				}
				variables={{ userID: this.props.userID }}
			>
				{(result: RecipesResult) => {
					if (result.loading) { return <div></div>; }
					if (result.error) {
						console.error(result.error);
						return <div>{result.error.message}</div>;
					}

					const recipes = this.props.type === RecipeType.AUTHORED
						? result.data!.user.authoredRecipes || []
						: result.data!.user.savedRecipes || [];

					return (
						<div>
							<ul className="no-style-list">
								{recipes.map((recipe, i) => {
									return (
										<li key={i}>
											<hr className="recipe-summary-seperator" />
											<RecipeSummaryContainer recipeID={recipe.id!} showAuthor={this.props.showAuthor} />
										</li>
									);
								})}
							</ul>
						</div>
					);
				}}
			</Query>
		);
	}
}
