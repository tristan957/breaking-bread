import gql from "graphql-tag";
import React from "react";
import { Query, QueryResult } from "react-apollo";
import { UserReviews } from "../components/UserReviews";
import User from "../entities/User";
import "./resources/css/ProfileActivityContainer.css";
import "./resources/css/UserDetailsContainer.css";

const USER_REVIEWS = gql`
	query UserReviews($userID: Int!) {
		user(id: $userID) {
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

interface IUserReviewsData {
	user: Partial<User>;
}

interface IUserReviewsVariables {
	userID: number;
}

type UserReviewsResult = QueryResult<IUserReviewsData, IUserReviewsVariables>;

interface IUserReviewsContainerProps {
	userID: number;
}

export default class UserReviewsContainer extends React.Component<IUserReviewsContainerProps> {
	public render(): JSX.Element {
		return (
			<Query query={USER_REVIEWS} variables={{ userID: this.props.userID }}>
				{(result: UserReviewsResult) => {
					if (result.loading) { return <div></div>; }
					if (result.error) {
						console.error(result.error);
						return <div>{result.error.message}</div>
					}

					return (
						<div id="user-details-container" className="card">
							<h3>Reviews</h3>
							<UserReviews reviews={result.data!.user.reviews || []} />
						</div>
					)
				}}
			</Query>
		);
	}
}
