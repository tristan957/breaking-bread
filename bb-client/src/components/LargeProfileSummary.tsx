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

interface IUserToggleFollowingData {
	userToggleFollowing: Partial<User>[];
}

interface IUserToggleFollowingVariables {
	userID: number;
}

type UserToggleFollowingFn = MutationFn<IUserFollowingData, IUserToggleFollowingVariables>;
type UserToggleFollowingResult = MutationResult<IUserFollowingData>;

interface ILargeProfileSummaryProps {
	userID: number;
	viewerID?: number;
	imagePath?: string;
	name: string;
	reviewAverage?: number;
	numberOfFollowers?: number;
}

export default class LargeProfileSummary extends React.Component<ILargeProfileSummaryProps> {
	public render(): JSX.Element {
		return (
			<div id="large-profile-summary">
				<img src={this.props.imagePath || defaultUserPic} alt="Profile Picture" id="large-profile-summary-picture" />
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

									// console.log(this.props.viewerID);
									// console.log(this.props.userID);
									// console.log(qResult.data!.user.followedUsers);

									const isFollowing = this.props.viewerID === undefined || qResult.data!.user.followedUsers === undefined || qResult.data!.user.followedUsers!.length === 0
										? false
										: qResult.data!.user.followedUsers!.some(followedUser => {
											if (followedUser.id === this.props.userID) {
												return true;
											}

											return false;
										});

									return (
										<Mutation mutation={USER_TOGGLE_FOLLOWING} variables={{ userID: this.props.userID }} onCompleted={() => qResult.refetch()}>
											{(userToggleFollowing: UserToggleFollowingFn, mResult: UserToggleFollowingResult) => {
												if (mResult.error) {
													console.error(mResult.error);
													return <div>{mResult.error.message}</div>;
												}

												return this.props.viewerID === undefined || qResult.data!.user.id === this.props.userID
													? <div></div>
													: (
														<Button
															onClick={(e: React.MouseEvent<HTMLButtonElement>) => userToggleFollowing()}
														>
															{isFollowing ? "Unfollow" : "Follow"}
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
