import gql from "graphql-tag";
import React from "react";
import { Mutation, MutationFn, MutationResult } from "react-apollo";
import { Button } from "reactstrap";
import Topic from "../entities/Topic";
import "./resources/css/Topics.css";

const USER_TOGGLE_WHITELIST = gql`
	mutation UserToggleWhitelist($topics: [TopicInput!]!) {
		userToggleWhitelist(topics: $topics) {
			id
			name
		}
	}
`;

interface IUserToggleWhitelistData {
	userToggleFollowedTopics: Partial<Topic>[];
}

interface IUserToggleWhitelistVariables {
	topics: Partial<Topic>[];
}

type UserToggleWhitelistResult = MutationResult<IUserToggleWhitelistData>;
type UserToggleWhitelistFn = MutationFn<IUserToggleWhitelistData, IUserToggleWhitelistVariables>;

const USER_TOGGLE_BLACKLIST = gql`
	mutation UserToggleBlacklist($topics: [TopicInput!]!) {
		userToggleBlacklist(topics: $topics) {
			id
			name
		}
	}
`;

interface IUserToggleBlacklistData {
	userToggleBlacklist: Partial<Topic>[];
}

interface IUserToggleBlacklistVariables {
	topics: Partial<Topic>[];
}

type UserToggleBlacklistResult = MutationResult<IUserToggleBlacklistData>;
type UserToggleBlacklistFn = MutationFn<IUserToggleBlacklistData, IUserToggleBlacklistVariables>;

export enum TopicType {
	WHITELIST,
	BLACKLIST,
}

interface ITopicsProps {
	type: TopicType;
	mutable?: boolean;
	topics: Partial<Topic>[];
	reload?(): void;
}

export default class Topics extends React.Component<ITopicsProps> {
	public render(): JSX.Element {
		return (
			<div>
				<ul className="no-style-list topics-list">
					{this.props.topics.map((topic, i) => {
						return (
							<li key={i} className="topics-list-topic">
								<div>{`#${topic.name}`}</div>
								{this.props.mutable
									? this.props.type === TopicType.WHITELIST
										? (
											<Mutation mutation={USER_TOGGLE_WHITELIST} onCompleted={() => this.props.reload!()}>
												{(userToggleWhitelist: UserToggleWhitelistFn, result: UserToggleWhitelistResult) => {
													if (result.error) {
														console.error(result.error);
														return <div>{result.error.message}</div>;
													}

													return (
														<Button close onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
															userToggleWhitelist({ variables: { topics: [{ id: topic.id }] } });
														}} />
													);
												}}
											</Mutation>
										) : (
											<Mutation mutation={USER_TOGGLE_BLACKLIST} onCompleted={() => this.props.reload!()}>
												{(userToggleBlacklist: UserToggleBlacklistFn, result: UserToggleBlacklistResult) => {
													if (result.error) {
														console.error(result.error);
														return <div>{result.error.message}</div>;
													}

													return (
														<Button close onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
															userToggleBlacklist({ variables: { topics: [{ id: topic.id }] } });
														}} />
													);
												}}
											</Mutation>
										)
									: undefined
								}
							</li>
						);
					})}
				</ul>
			</div>
		);
	}
}
