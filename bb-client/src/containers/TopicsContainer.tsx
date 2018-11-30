import gql from "graphql-tag";
import React from "react";
import { Query, QueryResult } from "react-apollo";
import Items from "../components/Items";
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
	userID: number;
}

export default class TopicsContainer extends React.Component<ITopicsContainerProps> {
	public render(): JSX.Element {
		return (
			<div id="topics-container" className="card">
				<div className="tags-topics-list-header container-header">Topics</div>
				<hr className="seperator" />
				<Query query={USER_WHITELIST} variables={{ id: this.props.userID }}>
					{(result: UserWhitelistResult) => {
						if (result.loading) { return <div></div>; }
						if (result.error) {
							console.error(result.error);
							<div>{result.error.message}</div>;
						}

						// console.log(this.props.userID);
						// console.log(result);

						return (
							<Items
								items={result.data!.user.whitelist || []}
								leadingChar="#"
								monospace
							/>
						);
					}}
				</Query>
			</div>
		);
	}
}
