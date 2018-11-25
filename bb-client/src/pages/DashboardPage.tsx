// tslint:disable: no-unsafe-any
import { gql } from "apollo-boost";
import React from "react";
import { Query, QueryResult } from "react-apollo";
import MediaQuery from "react-responsive";
import { RouteComponentProps } from "react-router";
import { UserContext } from "../App";
import MobileSidebar from "../components/MobileSidebar";
import FeedContainer from "../containers/FeedContainer";
import ProfileSummaryContainer from "../containers/ProfileSummaryContainer";
import TagsContainer from "../containers/TagsContainer";
import TopicsContainer from "../containers/TopicsContainer";
import UpcomingMealsContainer from "../containers/UpcomingMealsContainer";
import Meal from "../entities/Meal";
import "./resources/css/DashboardPage.css";

export const GET_UPCOMING_MEALS = gql`
	query UpcomingMeals($ids: [Int]!) {
		getUpcomingMeals(ids: $ids) {
			id
			title
			price
			startTime
			endTime
			guests {
				id
			}
			maxGuests
			location
		}
	}
`;

interface IGetAttendingMealsResult {
	getUpcomingMeals: Partial<Meal>[];
}

export default class DashboardPage extends React.Component<RouteComponentProps> {
	public render(): JSX.Element {
		return (
			<UserContext.Consumer>
				{userContext => {
					return (
						<Query
							query={GET_UPCOMING_MEALS}
							variables={{ ids: userContext.user!.mealsAttending!.map(meal => meal.id!) }}
						>
							{(result: QueryResult<IGetAttendingMealsResult>) => {
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

								return (
									<div>
										<MediaQuery query="(max-width: 949px)">
											<div id="mobileSidebar">
												<MobileSidebar user={userContext.user} />
											</div>
											<div id="top-buffer"></div>
											<div id="mobile-center">
												<FeedContainer />
											</div>
										</MediaQuery>

										<MediaQuery query="(min-width: 950px)">
											<div id="dashboard">
												<div id="left-container">
													{
														userContext.user === undefined ? undefined : (
															<div>
																<ProfileSummaryContainer user={userContext.user} />
																<TagsContainer tags={userContext.user.followedTags || []} />
																<TopicsContainer topics={userContext.user.whitelist || []} />
															</div>
														)
													}
												</div>
												<div id="center-container">
													<FeedContainer />
												</div>
												<div id="right-container">
													{
														userContext.user === undefined ? undefined : (
															<UpcomingMealsContainer mealsAttending={result.data!.getUpcomingMeals || []} />
														)
													}
												</div>
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
