import gql from "graphql-tag";
import React from "react";
import { Query, QueryResult } from "react-apollo";
import RecipeSummary from "../components/RecipeSummary";
import Recipe from "../entities/Recipe";

const RECIPE = gql`
	query Recipe($recipeID: Int!) {
		recipe(id: $recipeID) {
			id
			author {
				id
			}
			name
			tags {
				id
				name
			}
			createdAt
			updatedAt
			reviewAverage
			timesSaved
			allergies {
				id
				name
			}
		}
	}
`;

interface IRecipeData {
	recipe: Partial<Recipe>;
}

interface IRecipeVariables {
	recipeID: number;
}

type RecipeResult = QueryResult<IRecipeData, IRecipeVariables>;

interface IRecipeSummaryContainerProps {
	showAuthor?: boolean;
	recipeID: number;
	viewerID?: number;
}

export default class RecipeSummaryContainer extends React.Component<IRecipeSummaryContainerProps> {
	public render(): JSX.Element {
		return (
			<Query query={RECIPE} variables={{ recipeID: this.props.recipeID }}>
				{(result: RecipeResult) => {
					if (result.loading) { return <div></div>; }
					if (result.error) {
						console.error(result.error);
						return <div>{result.error.message}</div>;
					}

					return (
						<div className="card">
							<RecipeSummary
								recipeID={result.data!.recipe.id!}
								authorID={result.data!.recipe.id!}
								viewerID={this.props.viewerID}
								name={result.data!.recipe.name!}
								tags={result.data!.recipe.tags || []}
								createdAt={result.data!.recipe.createdAt!}
								updatedAt={result.data!.recipe.updatedAt!}
								reviewAverage={result.data!.recipe.reviewAverage || 0}
								timesSaved={result.data!.recipe.timesSaved || 0}
								allergies={result.data!.recipe.allergies || []}
							/>
						</div>
					);
				}}
			</Query>
		);
	}
}
