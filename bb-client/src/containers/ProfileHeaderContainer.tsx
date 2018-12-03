import gql from "graphql-tag";
import React from "react";
import { Query, QueryResult } from "react-apollo";
import LargeProfileSummary from "../components/LargeProfileSummary";
import User from "../entities/User";
import "./resources/css/ProfileHeaderContainer.css";

const USER_PROFILE = gql`
	query UserProfile($id: Int!) {
		user(id: $id) {
			id
			name
			about
			imagePath
			reviewAverage
			numberOfFollowers
			createdAt
			phoneNumber
			email
		}
	}
`;

interface IUserProfileData {
	user?: Partial<User>;
}

interface IUserProfileVariables {
	id: number;
}

type UserProfileResult = QueryResult<IUserProfileData, IUserProfileVariables>;

interface IProfileHeaderProps {
	userID: number;
	viewerID?: number;
}

export default class ProfileHeaderContainer extends React.Component<IProfileHeaderProps> {
	public render(): JSX.Element {
		return (
			<Query query={USER_PROFILE} variables={{ id: this.props.userID }}>
				{(result: UserProfileResult) => {
					if (result.loading) { return <div></div>; }
					if (result.error) {
						console.error(result.error);
						return <div>{result.error.message}</div>;
					}

					return (
						<div id="profile-header-container" className="card">
							<div id="profile-header-left-container">
								<LargeProfileSummary
									userID={result.data!.user!.id!}
									viewerID={this.props.viewerID}
									name={result.data!.user!.name!}
									imagePath={result.data!.user!.imagePath}
									reviewAverage={result.data!.user!.reviewAverage}
									numberOfFollowers={result.data!.user!.numberOfFollowers}
								/>
							</div>
							<div id="profile-header-right-container">
								<div id="profile-header-about-container">
									<p id="profile-header-about">{result.data!.user!.about}</p>
								</div>
								<div id="profile-header-contact-info">
									{result.data!.user!.email === undefined ? undefined : <div>Email: {result.data!.user!.email}</div>}
									{result.data!.user!.phoneNumber === undefined ? undefined : <div>Phone Number: {result.data!.user!.phoneNumber}</div>}
								</div>
								<div id="profile-header-joined">Joined {
									((joinedAt: string): string => {
										const date = new Date(joinedAt);
										return (
											`${date.getMonth()}/${date.getDate()}/${date.getFullYear()}`
										);
									})(result.data!.user!.createdAt!)
								}
								</div>
							</div>
						</div>
					);
				}}
			</Query>
		);
	}
}
