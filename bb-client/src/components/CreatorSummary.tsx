import gql from "graphql-tag";
import React from "react";
import { Query, QueryResult } from "react-apollo";
import User from "../entities/User";
import Items from "./Items";
import LargeProfileSummary from "./LargeProfileSummary";
import "./resources/css/CreatorSummary.css";

const CREATOR = gql`
	query Creator($userID: Int!) {
		user(id: $userID) {
			id
			name
			imagePath
			whitelist {
				id
				name
			}
			blacklist {
				id
				name
			}
		}
	}
`;

interface ICreatorData {
	user?: Partial<User>;
}

interface ICreatorVariables {
	userID: number;
}

type CreatorResult = QueryResult<ICreatorData, ICreatorVariables>;

interface ICreatorSummaryProps {
	userID: number;
	viewerID?: number;
}

export default class CreatorSummary extends React.Component<ICreatorSummaryProps> {
	public render(): JSX.Element {
		return (
			<Query query={CREATOR} variables={{ userID: this.props.userID }}>
				{(result: CreatorResult) => {
					if (result.loading) { return <div></div>; }
					if (result.error) {
						console.error(result.error);
						return <div>{result.error.message}</div>;
					}

					return (
						<div id="creator-summary">
							<LargeProfileSummary
								viewerID={this.props.viewerID}
								userID={result.data!.user!.id!}
								imagePath={result.data!.user!.imagePath}
								name={result.data!.user!.name!}
							/>
							<hr />
							<div id="creator-summary-topics-container">
								<h4>Whitelist Topics</h4>
								<Items
									monospace
									items={result.data!.user!.whitelist || []}
									leadingChar="#"
								/>
							</div>
						</div>
					);
				}}
			</Query>
		);
	}
}
