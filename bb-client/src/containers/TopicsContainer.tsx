import gql from "graphql-tag";
import React from "react";
import { Mutation, MutationFn, MutationResult, Query, QueryResult } from "react-apollo";
import { Button, Input, InputGroup, InputGroupAddon } from "reactstrap";
import Topics, { TopicType } from "../components/Topics";
import Topic from "../entities/Topic";
import User from "../entities/User";
import "./resources/css/TopicsContainer.css";

const USER_WHITELIST = gql`
	query UserWhitelist($id: Int!) {
		user(id: $id) {
			id
			whitelist {
				id
				name
			}
		}
	}
`;

const USER_BLACKLIST = gql`
	query UserBlacklist($id: Int!) {
		user(id: $id) {
			id
			blacklist {
				id
				name
			}
		}
	}
`;

interface IUserTopicsData {
	user: Partial<User>;
}

interface IUserTopicsVariables {
	id: number;
}

type UserTopicsResult = QueryResult<IUserTopicsData, IUserTopicsVariables>;

const USER_TOGGLE_BLACKLIST = gql`
	mutation UserToggleBlacklist($topics: [TopicInput!]!) {
		userToggleBlacklist(topics: $topics) {
			id
			name
		}
	}
`;

const USER_TOGGLE_WHITELIST = gql`
	mutation UserToggleBlacklist($topics: [TopicInput!]!) {
		userToggleWhitelist(topics: $topics) {
			id
			name
		}
	}
`;

interface IUserToggleListData {
	userToggleBlacklist?: Partial<Topic>[];
	userToggleWhitelist?: Partial<Topic>[];
}

interface ITopicsInput {
	id: number;
	name: string;
}

interface IUserToggleListVariables {
	topics: Partial<ITopicsInput>[];
}

type UserToggleListResult = MutationResult<IUserToggleListData>;
type UserToggleListFn = MutationFn<IUserToggleListData, IUserToggleListVariables>;

interface ITopicsContainerProps {
	mutable?: boolean;
	userID: number;
	type: TopicType;
	title?: string;
}

interface ITopicsContainerState {
	name?: string;
}

export default class TopicsContainer extends React.Component<ITopicsContainerProps, ITopicsContainerState> {
	constructor(props: ITopicsContainerProps) {
		super(props);

		this.state = {};
	}

	public render(): JSX.Element {
		return (
			<Query query={this.props.type === TopicType.WHITELIST ? USER_WHITELIST : USER_BLACKLIST} variables={{ id: this.props.userID }}>
				{(result: UserTopicsResult) => {
					if (result.loading) { return <div></div>; }
					if (result.error) {
						console.error(result.error);
						<div>{result.error.message}</div>;
					}

					return (
						<div id="topics-container" className="card">
							<div id="topics-list-header">
								<div className="container-header" id="topics-label">{this.props.title || "Topics"}</div>
								{this.props.mutable
									? (
										<Mutation mutation={this.props.type === TopicType.WHITELIST ? USER_TOGGLE_WHITELIST : USER_TOGGLE_BLACKLIST} onCompleted={() => result.refetch()}>
											{(userToggleList: UserToggleListFn, mResult: UserToggleListResult) => {
												if (mResult.error) {
													console.error(mResult.error);
													return <div>{mResult.error.message}</div>;
												}

												return (
													<InputGroup id="topic-input">
														<Input onChange={(e: React.ChangeEvent<HTMLInputElement>) => this.setState({ name: e.target.value })} />
														<InputGroupAddon addonType="append">
															<Button color="success" id="topic-add" onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
																userToggleList({ variables: { topics: [{ name: this.state.name }] } });
															}}>
																+
															</Button>
														</InputGroupAddon>
													</InputGroup>
												);
											}}
										</Mutation>
									) : undefined
								}
							</div>
							<hr className="seperator" />
							<Topics
								type={this.props.type}
								topics={this.props.type === TopicType.WHITELIST
									? result.data!.user.whitelist || []
									: result.data!.user.blacklist || []
								}
								mutable={this.props.mutable}
								reload={result.refetch}
							/>
						</div>
					);
				}}
			</Query>
		);
	}
}
