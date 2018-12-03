import gql from "graphql-tag";
import React from "react";
import { Query, QueryResult } from "react-apollo";
import Topics, { TopicType } from "../components/Topics";
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

interface IUserWhitelistData {
	user: Partial<User>;
}

interface IUserWhitelistVariables {
	id: number;
}

type UserWhitelistResult = QueryResult<IUserWhitelistData, IUserWhitelistVariables>;

interface ITopicsContainerProps {
	mutable?: boolean;
	userID: number;
	type: TopicType;
}

export default class TopicsContainer extends React.Component<ITopicsContainerProps> {
	public render(): JSX.Element {
		return (
			<Query query={USER_WHITELIST} variables={{ id: this.props.userID }}>
				{(result: UserWhitelistResult) => {
					if (result.loading) { return <div></div>; }
					if (result.error) {
						console.error(result.error);
						<div>{result.error.message}</div>;
					}

					return (
						<div id="topics-container" className="card">
							<div className="tags-topics-list-header container-header">Topics</div>
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
