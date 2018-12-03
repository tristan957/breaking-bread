import gql from "graphql-tag";
import React from "react";
import { Query, QueryResult } from "react-apollo";
import Tags from "../components/Tags";
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

interface ITagsContainerProps {
	mutable?: boolean;
	userID: number;
}

export default class TagsContainer extends React.Component<ITagsContainerProps> {
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
						<div id="followed-tags-card" className="card">
							<div id="tags-topics-list-header" className="container-header">Tags</div>
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
