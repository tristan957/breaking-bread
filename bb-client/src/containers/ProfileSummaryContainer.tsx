import gql from "graphql-tag";
import React from "react";
import { Query, QueryResult } from "react-apollo";
import ProfileSummary from "../components/ProfileSummary";
import User from "../entities/User";

const USER_PROFILE = gql`
	query UserProfile($id: Int!) {
		user(id: $id) {
			imagePath
			firstName
			lastName
		}
	}
`;

interface IUserProfileData {
	user: Partial<User>;
}

interface IUserProfileVariables {
	id: number;
}

type UserProfileResult = QueryResult<IUserProfileData, IUserProfileVariables>;

interface IProfileSummaryProps {
	userID: number;
}

export default class ProfileSummaryContainer extends React.Component<IProfileSummaryProps> {
	public render(): JSX.Element {
		return (
			<div className="card">
				<Query query={USER_PROFILE} variables={{ id: this.props.userID }}>
					{(result: UserProfileResult) => {
						if (result.loading) { return <div></div>; }
						if (result.error) {
							console.error(result.error);
							return <div>{result.error.message}</div>;
						}

						return (
							<ProfileSummary
								id={this.props.userID}
								name={`${result.data!.user.firstName} ${result.data!.user.lastName}`}
								imagePath={result.data!.user.imagePath}
							/>
						);
					}}
				</Query>
			</div>
		);
	}
}
