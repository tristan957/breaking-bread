import gql from "graphql-tag";
import React from "react";
import { Mutation, MutationFn, MutationResult, Query, QueryResult } from "react-apollo";
import { RouteComponentProps } from "react-router-dom";
import { Markdown } from "react-showdown";
import { Button } from "reactstrap";
import { UserContext } from "../App";
import CreatorSummary from "../components/CreatorSummary";
import GuestSummaries from "../components/GuestSummaries";
import RecipeSummary from "../components/RecipeSummary";
import MealSummaryContainer from "../containers/MealSummaryContainer";
import Meal from "../entities/Meal";
import User from "../entities/User";
import "./resources/css/MealPage.css";

const MEAL = gql`
	query meal($mealID: Int!) {
		meal(id: $mealID) {
			id
			description
			host {
				id
			}
			guests {
				id
				name
				imagePath
			}
			recipes {
				id
				name
				author {
					id
					name
					imagePath
				}
				createdAt
				updatedAt
				reviewAverage
				timesSaved
				tags {
					id
					name
				}
				allergies {
					id
					name
				}
			}
			guestCount
			maxGuests
		}
	}
`;

interface IMealData {
	meal?: Partial<Meal>;
}

interface IMealVariables {
	mealID: number;
}

type MealResult = QueryResult<IMealData, IMealVariables>;

const MEAL_TOGGLE_GUEST = gql`
	mutation RSVP($mealID: Int!, $guestID: Int!) {
		mealToggleGuest(mealID: $mealID, guestID: $guestID) {
			id
		}
	}
`;

interface IMealToggleGuestData {
	mealToggleGuest: Partial<User>[];
}

interface IMealToggleGuestVariables {
	mealID: number;
	guestID: number;
}

type MealToggleGuestResult = MutationResult<IMealToggleGuestData>;
type MealToggleGuestFn = MutationFn<IMealToggleGuestData, IMealToggleGuestVariables>;

interface IMealPageParams {
	mealID: string;
}

export default class MealPage extends React.Component<RouteComponentProps<IMealPageParams>> {
	public render(): JSX.Element {
		return (
			<UserContext.Consumer>
				{userContext => {
					const mealID = parseInt(this.props.match.params.mealID, 10);
					return (
						<Query query={MEAL} variables={{ mealID }}>
							{(result: MealResult) => {
								if (result.loading) { return <div></div>; }
								if (result.error) {
									console.error(result.error);
									return <div>{result.error.message}</div>;
								}
								if (result.data!.meal === undefined) {
									return <div></div>;
								}

								const isHost = userContext.userID === result.data!.meal!.host!.id;
								let isGuest = false;
								if (!isHost) {
									isGuest = userContext.userID === undefined || result.data!.meal!.guests === undefined || result.data!.meal!.guests!.length === 0
										? false
										: result.data!.meal!.guests!.some(guest => {
											if (guest.id === userContext.userID) {
												return true;
											}

											return false;
										});
								}

								return (
									<div id="meal-page">
										<div id="meal-page-left">
											<MealSummaryContainer mealID={result.data!.meal!.id!} />
											<div id="meal-page-description-container" className="card">
												<h3 className="meal-page-header">Description</h3>
												<hr />
												<div id="meal-page-description">{<Markdown markup={result.data!.meal!.description} />}</div>
											</div>
											<div id="meal-page-recipes-container" className="card">
												<h3 className="meal-page-header">Recipes</h3>
												<ul className="no-style-list">
													{result.data!.meal!.recipes!.map((recipe, i) => {
														return (
															<li key={i}>
																<hr />
																<RecipeSummary
																	authorID={recipe.author!.id!}
																	viewerID={userContext.userID}
																	name={recipe.name!}
																	tags={recipe.tags || []}
																	imagePath={recipe.imagePath}
																	createdAt={recipe.createdAt!}
																	updatedAt={recipe.updatedAt!}
																	reviewAverage={recipe.reviewAverage || 0}
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
											<div className="card">
												<CreatorSummary
													viewerID={userContext.userID!}
													userID={result.data!.meal!.host!.id!}
												/>
											</div>
											<div id="meal-page-guests-container" className="card">
												<div id="meal-page-guests-container-header">
													<h3 className="meal-page-header">Guests ({result.data!.meal!.guestCount}/{result.data!.meal!.maxGuests})</h3>
													<Mutation mutation={MEAL_TOGGLE_GUEST} variables={{ mealID, guestID: userContext.userID! }} onCompleted={() => result.refetch()}>
														{(mealToggleGuest: MealToggleGuestFn, mResult: MealToggleGuestResult) => {
															if (mResult.error) {
																console.error(mResult.error);
																return <div>{mResult.error.message}</div>;
															}

															return userContext.userID === undefined || isHost
																? <div></div>
																: isGuest
																	? <Button color="danger" onClick={(e: React.MouseEvent<HTMLButtonElement>) => mealToggleGuest()}>Cancel</Button>
																	: <Button color="success" onClick={(e: React.MouseEvent<HTMLButtonElement>) => mealToggleGuest()}>RSVP</Button>;
														}}
													</Mutation>
												</div>
												<hr />
												<GuestSummaries
													mealID={mealID}
													guests={result.data!.meal!.guests!}
													reload={isHost ? () => result.refetch() : undefined}
												/>
											</div>
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
