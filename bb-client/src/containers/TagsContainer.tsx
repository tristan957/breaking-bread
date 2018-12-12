import gql from "graphql-tag";
import React from "react";
import { Mutation, MutationFn, MutationResult, Query, QueryResult } from "react-apollo";
import { Button, Input, InputGroup, InputGroupAddon } from "reactstrap";
import Tags from "../components/Tags";
import Tag from "../entities/Tag";
import User from "../entities/User";
import "./resources/css/TagsContainer.css";

const USER_FOLLOWED_TAGS = gql`
	query UserFollowedTags($id: Int!) {
		user(id: $id) {
			id
			followedTags {
				id
				name
			}
		}
	}
`;

interface IUserFollowedTagsData {
	user: Partial<User>;
}

interface IUserFollowedTagsVariables {
	id: number;
}

type UserFollowedTagsResult = QueryResult<IUserFollowedTagsData, IUserFollowedTagsVariables>;

const USER_TOGGLE_FOLLOWED_TAGS = gql`
	mutation UserToggleFollowedTags($tags: [TagInput!]!) {
		userToggleFollowedTags(tags: $tags) {
			id
			name
		}
	}
`;

interface IUserToggleFollowedTagsData {
	userToggleFollowedTags: Partial<Tag>[];
}

interface IUserToggleFollowedTagsVariables {
	tags: Partial<Tag>[];
}

type UserToggleFollowedTagsResult = MutationResult<IUserToggleFollowedTagsData>;
type UserToggleFollowedTagsFn = MutationFn<IUserToggleFollowedTagsData, IUserToggleFollowedTagsVariables>;

interface ITagsContainerProps {
	mutable?: boolean;
	userID: number;
	title?: string;
}

interface ITagsContainerState {
	name?: string;
}

export default class TagsContainer extends React.Component<ITagsContainerProps, ITagsContainerState> {
	constructor(props: ITagsContainerProps) {
		super(props);

		this.state = {};
	}

	public render(): JSX.Element {
		return (
			<Query query={USER_FOLLOWED_TAGS} variables={{ id: this.props.userID }}>
				{(result: UserFollowedTagsResult) => {
					if (result.loading) { return <div></div>; }
					if (result.error) {
						console.error(result.error);
						<div>{result.error.message}</div>;
					}

					return (
						<div id="tags-container" className="card">
							<div id="tags-list-header">
								<div className="container-header" id="tags-label">{this.props.title || "Tags"}</div>
								{this.props.mutable
									? (
										<Mutation mutation={USER_TOGGLE_FOLLOWED_TAGS} onCompleted={() => result.refetch()}>
											{(userToggleFollowedTags: UserToggleFollowedTagsFn, mResult: UserToggleFollowedTagsResult) => {
												if (result.error) {
													console.error(result.error);
													return <div>{result.error.message}</div>;
												}

												return (
													<InputGroup id="tag-input">
														<Input onChange={(e: React.ChangeEvent<HTMLInputElement>) => this.setState({ name: e.target.value })} />
														<InputGroupAddon addonType="append">
															<Button color="success" id="tag-add" onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
																userToggleFollowedTags({ variables: { tags: [{ name: this.state.name }] } });
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
							<hr className="separator" />
							<Tags
								tags={result.data!.user.followedTags || []}
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
