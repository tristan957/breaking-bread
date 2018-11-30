import gql from "graphql-tag";
import React from "react";
import { Mutation, MutationFn, MutationResult, Query, QueryResult } from "react-apollo";
import Rating from "react-rating";
import { Link } from "react-router-dom";
import { Button } from "reactstrap";
import User from "../entities/User";
import "./resources/css/LargeProfileSummary.css";
import { default as defaultUserPic } from "./resources/images/default_user_pic.png";

const USER_FOLLOWING = gql`
	query UserFollowing($id: Int!) {
		user(id: $id) {
			id
			followedUsers {
				id
			}
		}
	}
`;

interface IUserFollowingData {
	user: Partial<User>;
}

interface IUserFollowingVariables {
	id: number;
}

type UserFollowingResult = QueryResult<IUserFollowingData, IUserFollowingVariables>;

const USER_TOGGLE_FOLLOWING = gql`
	mutation UserToggleFollowing($userID: Int!) {
		userToggleFollowing(userID: $userID) {
			id
		}
	}
`;

interface IUserToggleFollowingVariables {
	userID: number;
}

type UserToggleFollowingFn = MutationFn<Partial<User>[], IUserToggleFollowingVariables>;
type UserToggleFollowingResult = MutationResult<Partial<User>[]>;

interface ILargeProfileSummaryProps {
	userID: number;
	viewerID?: number;
	imagePath?: string | null;
	name: string;
	reviewAverage?: number;
	numberOfFollowers?: number;
}

export default class LargeProfileSummary extends React.Component<ILargeProfileSummaryProps> {
	private hostIsFollowed = (followedUsers: Partial<User>[]): boolean => {
		for (const followedUser of followedUsers) {
			if (followedUser.id === this.props.userID) {
				return true;
			}
		}

		return false;
	}

	private createFollowButton = (userToggleFollowing: UserToggleFollowingFn, followedUsers: Partial<User>[]): JSX.Element => {
		return (
			<Button onClick={(e: React.MouseEvent<HTMLButtonElement>) => userToggleFollowing({ variables: { userID: this.props.userID } })}></Button>
		);
	}

	public render(): JSX.Element {
		return (
			<div id="large-profile-summary">
				{
					this.props.imagePath === null
						? <img src={defaultUserPic} alt="Profile Picture" id="large-profile-summary-picture" />
						: <img src={this.props.imagePath || defaultUserPic} alt="Profile Picture" id="large-profile-summary-picture" />
				}
				<div id="large-profile-summary-name">
					<Link to={`/p/${this.props.userID}`} className="black-link-with-underline">
						{this.props.name}
					</Link>
				</div>
				{!this.props.reviewAverage
					? undefined
					: (
						<Rating
							readonly
							initialRating={this.props.reviewAverage}
						/>
					)
				}
				<div>
					{this.props.viewerID === undefined
						? <div></div>
						: (
							<Query query={USER_FOLLOWING} variables={{ id: this.props.viewerID }}>
								{(qResult: UserFollowingResult) => {
									if (qResult.loading) { return <div></div>; }
									if (qResult.error) {
										return <div>{qResult.error.message}</div>;
									}

									return (
										<Mutation mutation={USER_TOGGLE_FOLLOWING} onCompleted={() => qResult.refetch()}>
											{(userToggleFollowing: UserToggleFollowingFn, mResult: UserToggleFollowingResult) => {
												if (mResult.loading) {
													return <div></div>;
												}
												if (mResult.error) {
													console.error(mResult.error);
													return <div>{mResult.error.message}</div>;
												}

												return (
													<Button
														onClick={(e: React.MouseEvent<HTMLButtonElement>) => userToggleFollowing({ variables: { userID: this.props.userID } })}
													>{this.hostIsFollowed(qResult.data!.user.followedUsers || [])
														? "Unfollow"
														: "Follow"
														}
													</Button>
												);
											}}
										</Mutation>
									);
								}}
							</Query>
						)
					}
				</div>
			</div>
		);
	}
}
