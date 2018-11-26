import { gql } from "apollo-boost";
import React from "react";
import { Query, QueryResult } from "react-apollo";
import { RouteComponentProps } from "react-router-dom";
import { UserContext } from "../App";
import RecipeSummary from "../components/RecipeSummary";
import GuestsContainer from "../containers/GuestsContainer";
import HostSummaryContainer from "../containers/HostSummaryContainer";
import MealSummaryContainer from "../containers/MealSummaryContainer";
import Meal from "../entities/Meal";
import Recipe from "../entities/Recipe";
import User from "../entities/User";
import "./resources/css/MealPage.css";

const GET_MEAL = gql`
	query GetMeal($id: Int!) {
		getMeal(id: $id) {
			id
			title
			description
			price
			startTime
			endTime
			maxGuests
			location
			host {
				id
				firstName
				lastName
				about
				whitelist {
					id
					name
				}
			}
			guests {
				id
				firstName
				lastName
			}
			recipes {
				id
				name
				description
				timesSaved
				updatedAt
				createdAt
				tags {
					id
					name
				}
				allergies {
					id
					name
				}
			}
		}
	}
`;

interface IGetMealResult {
	getMeal: Partial<Meal> | null;
}

interface IMealPageParams {
	mealID: string;
}

export default class MealPage extends React.Component<RouteComponentProps<IMealPageParams>> {
	private getRecipeReviewAverage = (recipe: Partial<Recipe>): number => { // TODO: deduplicate
		if (recipe.reviews === undefined || recipe.reviews.length === 0) {
			return 0;
		}

		let sum = 0;
		let effectiveLength = 0;
		recipe.reviews.forEach(review => {
			if (review.rating !== undefined) {
				sum += review.rating;
				effectiveLength += 1;
			}
		});

		return sum / effectiveLength;
	}

	public setMeal = (
		startTime?: number,
		endTime?: number,
		title?: string,
		location?: string,
		description?: string
	): void => {
		// TODO: update the date and time
		// TODO: Push update to server
		alert("Need to push to server");
		// this.setState({ meal: { ...this.state.meal, title: title!, location: location!, description: description! } });
	}

	public render(): JSX.Element {
		return (
			<UserContext.Consumer>
				{userContext => {
					return (
						<Query
							query={GET_MEAL}
							variables={{ id: parseInt(this.props.match.params.mealID, 10) }}
						>
							{(result: QueryResult<IGetMealResult>) => {
								if (result.loading) {
									return <div></div>;
								}
								if (result.error) {
									return (
										<div>
											{`Error! Something terrible has happened! ${result.error.message}`}
										</div>
									);
								}
								if (result.data!.getMeal === null) {
									return (
										<div>
											{`Error! This page does not exist! It may have been deleted.`}
										</div>
									);
								}

								console.log(result);
								const loggedInUserIsGuest = result.data!.getMeal!.host!.id! === userContext.user!.id!;
								return (
									<div id="meal-page">
										<div id="meal-page-left">
											<MealSummaryContainer meal={result.data!.getMeal!} />
											<div id="meal-page-description-container" className="card">
												<h3 className="meal-page-header">Description</h3>
												<hr />
												<p id="meal-page-description">{result.data!.getMeal!.description}</p>
											</div>
											<div id="meal-page-recipes-container" className="card">
												<h3 className="meal-page-header">Recipes</h3>
												<ul className="no-style-list">
													{result.data!.getMeal!.recipes!.map((recipe, i) => {
														return (
															<li key={i}>
																<hr />
																<RecipeSummary
																	name={recipe.name!}
																	tags={recipe.tags || []}
																	imagePath={recipe.imagePath}
																	createdAt={recipe.createdAt!}
																	updatedAt={recipe.updatedAt!}
																	reviewAverage={this.getRecipeReviewAverage(recipe)}
																	timesSaved={recipe.timesSaved || 0}
																	allergies={recipe.allergies || []}
																	showAuthor
																/>
															</li>
														);
													})}
												</ul>
											</div>
										</div>
										<div id="meal-page-right">
											<HostSummaryContainer
												id={result.data!.getMeal!.host!.id as number}
												name={`${result.data!.getMeal!.host!.firstName} ${result.data!.getMeal!.host!.lastName}`}
												about={result.data!.getMeal!.host!.about as string}
												imagePath={result.data!.getMeal!.host!.imagePath}
												topics={result.data!.getMeal!.host!.whitelist || []}
											/>
											<GuestsContainer
												guests={result.data!.getMeal!.guests as Partial<User>[]}
												maxGuests={result.data!.getMeal!.maxGuests as number}
												isGuest={loggedInUserIsGuest}
											/>
											{/* <MealActionsContainer meal={this.state.meal} setMeal={this.setMeal} /> */}
										</div>
										{/* TODO: If the meal has past, and the context user was a guest => review ability should show */}
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
