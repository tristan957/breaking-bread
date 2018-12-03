import gql from "graphql-tag";
import React from "react";
import { Mutation, MutationFn, MutationResult } from "react-apollo";
import { Button } from "reactstrap";
import Tag from "../entities/Tag";
import "./resources/css/Tags.css";

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

interface ITagsProps {
	mutable?: boolean;
	tags: Partial<Tag>[];
	reload?(): void;
}

export default class Tags extends React.Component<ITagsProps> {
	public render(): JSX.Element {
		return (
			<div>
				<ul className="no-style-list tags-list">
					{this.props.tags.map((tag, i) => {
						return (
							<li key={i} className="tags-list-tag">
								<div>{`#${tag.name}`}</div>
								{this.props.mutable
									? (
										<Mutation mutation={USER_TOGGLE_FOLLOWED_TAGS} onCompleted={() => this.props.reload!()}>
											{(userToggleFollowedTags: UserToggleFollowedTagsFn, result: UserToggleFollowedTagsResult) => {
												if (result.error) {
													console.error(result.error);
													return <div>{result.error.message}</div>;
												}

												return (
													<Button close onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
														userToggleFollowedTags({ variables: { tags: [{ id: tag.id }] } });
													}} />
												);
											}}
										</Mutation>
									) : undefined
								}
							</li>
						);
					})}
				</ul>
			</div>
		);
	}
}
