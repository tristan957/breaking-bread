import gql from "graphql-tag";
import React from "react";
import { Query, QueryResult } from "react-apollo";
import User from "../entities/User";
import ProfileSummaryContainer from "./ProfileSummaryContainer";
import "./resources/css/ProfileSummariesContainers.css";

const USER_FOLLOWED_USERS = gql`
	query UserFollowedUsers($userID: Int!) {
		user(id: $userID) {
			id
			followedUsers {
				id
			}
		}
	}
`;

const USER_FOLLOWING_USERS = gql`
	query UserFollowingUsers($userID: Int!) {
		user(id: $userID) {
			id
			followers {
				id
			}
		}
	}
`;

export enum UserType {
	FOLLOWERS,
	FOLLOWED,
}

interface IUsersData {
	user: Partial<User>;
}

interface IUsersVariables {
	userID: number;
}

type UsersResult = QueryResult<IUsersData, IUsersVariables>;

interface IUsersContainersProps {
	userID: number;
	type: UserType;
}

export default class UsersContainers extends React.Component<IUsersContainersProps> {
	public render(): JSX.Element {
		return (
			<Query
				query={
					this.props.type === UserType.FOLLOWED
						? USER_FOLLOWED_USERS
						: USER_FOLLOWING_USERS
				}
				variables={{ userID: this.props.userID }}
			>
				{(result: UsersResult) => {
					if (result.loading) { return <div></div>; }
					if (result.error) {
						console.error(result.error);
						return <div>{result.error.message}</div>;
					}

					const users = this.props.type === UserType.FOLLOWED
						? result.data!.user.followedUsers || []
						: result.data!.user.followers || [];

					return (
						<div id="profile-summaries-containers">
							{users.map((user, i) => {
								return <ProfileSummaryContainer key={i} userID={user.id!} />;
							})}
						</div>
					);
				}}
			</Query>
		);
	}
}
