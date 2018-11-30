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
			imagePath
			reviewAverage
			numberOfFollowers
			createdAt
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

interface IProfileHeaderProps {
	userID: number;
	viewerID?: number;
}

export default class ProfileHeader extends React.Component<IProfileHeaderProps> {
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
									userID={result.data!.user.id!}
									viewerID={this.props.viewerID}
									name={result.data!.user.name!}
									imagePath={result.data!.user.imagePath}
									reviewAverage={result.data!.user.reviewAverage}
									numberOfFollowers={result.data!.user.numberOfFollowers}
								/>
							</div>
							<div id="profile-header-right-container">
								<div id="profile-header-about-container">
									<p id="profile-header-about">This is why folks still use tables for grid layout. Vertical align (or anything with height & dynamic data) can be challenging with pure CSS. You have to be willing to do weird hacks like this (somewhat defeats the "separating content from layout" idea), or take the multi-pass rendering hit and use non-static tables. I've never once had complaints from end users for table despite that I routinely break CSS fanboys' hearts. Most of em design only simple blogs & static sites. Some of us build business software and need dense data display, and our users care more about functionality.</p>
								</div>
								<div id="profile-header-joined">Joined {
									((joinedAt: string): string => {
										const date = new Date(joinedAt);
										return (
											`${date.getMonth()}/${date.getDate()}/${date.getFullYear()}`
										);
									})(result.data!.user.createdAt!)
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
