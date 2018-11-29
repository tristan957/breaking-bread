import gql from "graphql-tag";
import React from "react";
import { Mutation, MutationFn, MutationResult } from "react-apollo";
import Rating from "react-rating";
import { Link } from "react-router-dom";
import { Button } from "reactstrap";
import User from "../entities/User";
import "./resources/css/LargeProfileSummary.css";
import { default as defaultUserPic } from "./resources/images/default_user_pic.png";

const TOGGLE_FOLLOWED_USER = gql`
	mutation ToggleFollowedUser($userID: Int!) {
		toggleFollowedUser(userID: $userID) {
			id
		}
	}
`;

type ToggleFollowedUserArgs = {
	userID: number;
};

interface ILargeProfileSummaryProps {
	userID: number;
	viewer?: Partial<User>;
	imagePath?: string | null;
	name: string;
	reviewAverage?: number;
	numberOfFollowers?: number;
}

export default class LargeProfileSummary extends React.Component<ILargeProfileSummaryProps> {
	private hostIsFollowedOnPageLoad = (): boolean => {
		for (const followedUser of this.props.viewer!.followedUsers!) {
			if (followedUser.id === this.props.userID) {
				return true;
			}
		}

		return false;
	}

	private createFollowButton = (mutateFn: MutationFn<Partial<User>, ToggleFollowedUserArgs>, result: MutationResult<Partial<User>>): JSX.Element => {
		if (this.props.viewer === undefined || this.props.userID === this.props.viewer.id) {
			return <div></div>;
		}

		console.log(this.hostIsFollowedOnPageLoad());
		if (this.hostIsFollowedOnPageLoad()) {
			return (
				<Button onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
					if (result.data !== undefined) {
						this.props.viewer!.followedUsers = this.props.viewer!.followedUsers!.filter(user => user.id !== this.props.viewer!.id);
					}
					return mutateFn({ variables: { userID: this.props.userID } });
				}}>Unfollow</Button>
			);
		}

		return <Button onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
			if (result.data !== undefined) {
				this.props.viewer!.followedUsers!.push(result.data);
			}
			return mutateFn({ variables: { userID: this.props.userID } });
		}}>Follow</Button>;
	}

	public render(): JSX.Element {
		return (
			<div id="large-profile-summary">
				{
					this.props.imagePath === null
						? (
							<img src={defaultUserPic} alt="Profile Picture" id="large-profile-summary-picture" />
						) : (
							<img src={this.props.imagePath || defaultUserPic} alt="Profile Picture" id="large-profile-summary-picture" />
						)
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
					<Mutation mutation={TOGGLE_FOLLOWED_USER}>
						{(mutateFn: MutationFn<Partial<User>, ToggleFollowedUserArgs>, result: MutationResult<Partial<User>>) => {
							if (result.loading) {
								return <div></div>;
							}

							if (result.error) {
								return <div></div>;
							}
							return this.createFollowButton(mutateFn, result);
						}}
					</Mutation>
				</div>
			</div>
		);
	}
}
