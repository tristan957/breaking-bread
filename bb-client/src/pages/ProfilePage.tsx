import { gql } from "apollo-boost";
import React from "react";
import { Query, QueryResult } from "react-apollo";
import { RouteComponentProps } from "react-router";
import { UserContext } from "../App";
import ProfileHeaderContainer from "../containers/ProfileHeaderContainer";
import TopicsContainer from "../containers/TopicsContainer";
import UpcomingMealsContainer from "../containers/UpcomingMealsContainer";
import User from "../entities/User";
import "./resources/css/ProfilePage.css";

const USER_VALIDATE = gql`
	query User($id: Int!) {
		user(id: $id) {
			id
		}
	}
`;

interface IUserValidateData {
	user: Partial<User> | null;
}

interface IUserValidateVariables {
	id: number;
}

type UserValidateResult = QueryResult<IUserValidateData, IUserValidateVariables>;

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
					const userID = parseInt(this.props.match.params.userID!, 10);
					return (
						<Query query={USER_VALIDATE} variables={{ id: userID }}
						>
							{(result: UserValidateResult) => {
								if (result.loading) {
									return <div></div>;
								}
								if (result.error) {
									return <div>{result.error.message}</div>;
								}

								if (result.data!.user === null) {
									return <div>TODO: this should be a user not found page</div>;
								}

								return (
									<div>
										<div id="profile-info">
											<div id="profile-info-top">
												<ProfileHeaderContainer userID={result.data!.user!.id!} />
											</div>
											<div id="profile-info-bottom">
												<div id="profile-info-topics">
													<TopicsContainer userID={result.data!.user!.id!} />
													<TopicsContainer userID={result.data!.user!.id!} />
												</div>
												<div id="profile-info-upcoming">
													<UpcomingMealsContainer userID={userID} />
												</div>
											</div>
										</div>
										<div id="profile-details">
											{/* <ProfileActivityContainer userID={result.data!.user!.id!} /> */}
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
