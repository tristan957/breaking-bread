// tslint:disable: no-unsafe-any
import { gql } from "apollo-boost";
import React from "react";
import { Query, QueryResult } from "react-apollo";
import { RouteComponentProps } from "react-router";
import { UserContext } from "../App";
import ProfileActivityContainer from "../containers/ProfileActivityContainer";
import ProfileHeader from "../containers/ProfileHeaderContainer";
import TopicsContainer from "../containers/TopicsContainer";
import UpcomingMealsContainer from "../containers/UpcomingMealsContainer";
import User from "../entities/User";
import "./resources/css/ProfilePage.css";

const GET_USER_PROFILE = gql`
	query GetUser($id: Int!) {
		getUser(id: $id) {
			id
			firstName
			lastName
			createdAt
			imagePath
			whitelist {
				id
				name
			}
			blacklist {
				id
				name
			}
			followedTags {
				id
				name
			}
			hostedMeals {
				id
				title
				startTime
				endTime
				location
				price
				recipes {
					tags {
						id
						name
					}
				}
				host {
					id
					firstName
					lastName
					about
					imagePath
				}
				guests {
					id
					firstName
					lastName
				}
				maxGuests
			}
			upcomingMeals {
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
			followedUsers {
				id
				firstName
				lastName
			}
			recipesAuthored {
				id
				name
				imagePath
				description
				timesSaved
				tags {
					id
					name
				}
			}
			reviews {
				id
				rating
			}
		}
	}
`;

interface IGetUserProfileResult {
	getUser: Partial<User> | null;
}

interface IProfilePageParams {
	userID?: string;
}

export default class ProfilePage extends React.Component<RouteComponentProps<IProfilePageParams>> {
	private getUserReviewAverage(userBeingViewed: Partial<User>): number {
		if (userBeingViewed.reviews === undefined || userBeingViewed.reviews.length === 0) {
			return 0;
		}

		let sum = 0;
		let effectiveLength = 0;
		for (const review of userBeingViewed.reviews) {
			if (review.rating !== undefined) {
				sum += review.rating;
				effectiveLength += 1;
			}
		}

		return sum / effectiveLength;
	}

	public render(): JSX.Element {
		return (
			<UserContext.Consumer>
				{userContext => {
					return (
						<Query
							query={GET_USER_PROFILE}
							variables={{ id: parseInt(this.props.match.params.userID!, 10) }}
						>
							{(result: QueryResult<IGetUserProfileResult>) => {
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
								if (result.data!.getUser === null) {
									return (
										<div>
											{`Error! Doesn't look like that user exists.`}
										</div>
									);
								}

								return (
									<div>
										<div id="profile-info">
											<div id="profile-info-top">
												<ProfileHeader
													userID={result.data!.getUser!.id!}
													viewer={userContext.user}
													name={`${result.data!.getUser!.firstName} ${result.data!.getUser!.lastName}`}
													about={result.data!.getUser!.about as string}
													whiteList={result.data!.getUser!.whitelist || []}
													blackList={result.data!.getUser!.blacklist || []}
													imagePath={result.data!.getUser!.imagePath}
													joinedAt={result.data!.getUser!.createdAt as number}
													reviewAverage={this.getUserReviewAverage(result.data!.getUser!)}
													numberOfFollowers={result.data!.getUser!.followedUsers!.length || 0}
												/>
											</div>
											<div id="profile-info-bottom">
												<div id="profile-info-topics">
													<TopicsContainer topics={result.data!.getUser!.whitelist || []} />
													<TopicsContainer topics={result.data!.getUser!.blacklist || []} />
												</div>
												<div id="profile-info-upcoming">
													<UpcomingMealsContainer mealsAttending={result.data!.getUser!.upcomingMeals || []} />
												</div>
											</div>
										</div>
										<div id="profile-activity-info-container">  {/* Essentially a mini feed for a specific user */}
											<ProfileActivityContainer
												hostedMeals={result.data!.getUser!.hostedMeals || []}
												authoredRecipes={result.data!.getUser!.recipesAuthored || []}
												savedRecipes={result.data!.getUser!.savedRecipes || []}
												followedUsers={result.data!.getUser!.followedUsers || []}
											/>
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
