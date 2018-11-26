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

interface ILargeProfileSummaryState {
	followLabel: "Follow" | "Unfollow";
}

export default class LargeProfileSummary extends React.Component<ILargeProfileSummaryProps, ILargeProfileSummaryState> {
	constructor(props: ILargeProfileSummaryProps) {
		super(props);

		this.state = {
			followLabel: this.hostIsFollowedOnPageLoad() ? "Unfollow" : "Follow",
		};
	}

	private toggleFollowing = () => {
		const method = this.state.followLabel === "Unfollow" ? "delete" : "post";
		console.log(`${this.props.userID} ${this.props.viewer!.id}`);
		console.log(`${URI}/users/${this.props.userID}/followers`);
		fetch(`${URI}/users/${this.props.userID}/followers`, {
			method,
			body: JSON.stringify({ id: this.props.viewer!.id }),
			headers: {
				"Content-Type": "application/json",
			},
		}).then(value => {
			if (this.state.followLabel === "Unfollow") {
				this.setState({ followLabel: "Follow" });
			} else {
				this.setState({ followLabel: "Unfollow" });
			}
		}).catch(err => {
			console.log(err);
		});
	}

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

		return <Button onClick={(e: React.MouseEvent<HTMLButtonElement>) => this.toggleFollowing()}>{this.state.followLabel}</Button>;
	}

	// public shouldComponentUpdate(nextProps: ILargeProfileSummaryProps, nextState: ILargeProfileSummaryState): boolean {
	// 	console.log("we here");
	// 	return this.state.following !== nextState.following;
	// }

	public UNSAFE_componentWillMount(): void {
		// fetch(`${uri}/users/${this.props.userID}`, {
		// 	method: "post",
		// 	headers: {

		// 	}
		// });
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
