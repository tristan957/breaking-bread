// tslint:disable: no-unsafe-any
import { gql } from "apollo-boost";
import React from "react";
import { Query, QueryResult } from "react-apollo";
import MediaQuery from "react-responsive";
import { RouteComponentProps } from "react-router-dom";
import { UserContext } from "../App";
import MealDescription from "../components/MealDescription";
import GuestsContainer from "../containers/GuestsContainer";
import HostSummaryContainer from "../containers/HostSummaryContainer";
import Meal from "../entities/Meal";
import User from "../entities/User";
import "./resources/css/MealPage.css";

const GET_MEAL = gql`
	query GetMeal($id: Int!) {
		getMeal(id: $id) {
			id
			title
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
			}
		}
	}
`;

interface IGetMealResult {
	getMeal: Partial<Meal>;
}

interface IMealPageParams {
	mealID: string;
}

export default class MealPage extends React.Component<RouteComponentProps<IMealPageParams>> {
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
								console.log(result);
								const loggedInUserIsGuest = result.data!.getMeal.host!.id! === userContext.user!.id!;
								return (
									<div>
										<MediaQuery query="(max-width: 949px)">
											<div>
												<div id="mobileArticle">
													<HostSummaryContainer
														id={result.data!.getMeal.host!.id as number}
														name={`${result.data!.getMeal.host!.firstName} ${result.data!.getMeal.host!.lastName}`}
														about={result.data!.getMeal.host!.about as string}
														imagePath={result.data!.getMeal.host!.imagePath}
														topics={result.data!.getMeal.host!.whitelist || []}
													/>
													<MealDescription
														meal={result.data!.getMeal}
														isGuest={loggedInUserIsGuest}
														setMeal={this.setMeal}
													/>
													<GuestsContainer
														guests={result.data!.getMeal.guests as Partial<User>[]}
														maxGuests={result.data!.getMeal.maxGuests as number}
														isGuest={loggedInUserIsGuest}
													/>
													{/* <MealActionsContainer meal={this.state.meal} setMeal={this.setMeal} /> */}
												</div>
											</div>
										</MediaQuery>

										<MediaQuery query="(min-width: 950px)">
											<div>
												<div id="Article">
													<MealDescription
														meal={result.data!.getMeal}
														isGuest={loggedInUserIsGuest}
														setMeal={this.setMeal}
													/>
												</div>
												<div id="ArticleRight">
													<HostSummaryContainer
														id={result.data!.getMeal.host!.id as number}
														name={`${result.data!.getMeal.host!.firstName} ${result.data!.getMeal.host!.lastName}`}
														about={result.data!.getMeal.host!.about as string}
														imagePath={result.data!.getMeal.host!.imagePath}
														topics={result.data!.getMeal.host!.whitelist || []}
													/>
													<GuestsContainer
														guests={result.data!.getMeal.guests as Partial<User>[]}
														maxGuests={result.data!.getMeal.maxGuests as number}
														isGuest={loggedInUserIsGuest}
													/>
													{/* <MealActionsContainer meal={this.state.meal} setMeal={this.setMeal} /> */}
												</div>
												{/* TODO: If the meal has past, and the context user was a guest => review ability should show */}
											</div>
										</MediaQuery>
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
