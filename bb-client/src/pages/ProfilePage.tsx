import gql from "graphql-tag";
import React from "react";
import { Query, QueryResult } from "react-apollo";
import { RouteComponentProps } from "react-router";
import { UserContext } from "../App";
import { TopicType } from "../components/Topics";
import ProfileActivityContainer from "../containers/ProfileActivityContainer";
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
	user?: Partial<User>;
}

interface IUserValidateVariables {
	id: number;
}

type UserValidateResult = QueryResult<IUserValidateData, IUserValidateVariables>;

interface IProfilePageParams {
	userID?: string;
}

export default class ProfilePage extends React.Component<RouteComponentProps<IProfilePageParams>> {
	public render(): JSX.Element {
		return (
			<UserContext.Consumer>
				{userContext => {
					const userID = parseInt(this.props.match.params.userID!, 10);
					return (
						<Query query={USER_VALIDATE} variables={{ id: userID }}>
							{(result: UserValidateResult) => {
								if (result.loading) {
									return <div></div>;
								}
								if (result.error) {
									return <div>{result.error.message}</div>;
								}

								if (result.data!.user === undefined) {
									return <div>TODO: this should be a user not found page</div>;
								}

								const isViewingSelf = userContext.userID === undefined || userContext.userID !== userID ? false : true;

								return (
									<div id="profile-page">
										<div id="profile-info">
											<div id="profile-info-top">
												<ProfileHeaderContainer userID={result.data!.user!.id!} viewerID={userContext.userID} />
											</div>
											<div id="profile-info-bottom">
												<div id="profile-info-topics">
													<TopicsContainer userID={result.data!.user!.id!} mutable={isViewingSelf} type={TopicType.WHITELIST} />
													<TopicsContainer userID={result.data!.user!.id!} mutable={isViewingSelf} type={TopicType.BLACKLIST} />
												</div>
												<div id="profile-info-upcoming">
													<UpcomingMealsContainer userID={userID} />
												</div>
											</div>
										</div>
										<div id="#profile-info-activity-container">
											<ProfileActivityContainer userID={result.data!.user!.id!} />
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
