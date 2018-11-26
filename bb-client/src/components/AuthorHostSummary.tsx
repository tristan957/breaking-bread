import React from "react";
import { Link } from "react-router-dom";
import Topic from "../entities/Topic";
import Items from "./Items";
import LargeProfileSummary from "./LargeProfileSummary";
import "./resources/css/AuthorHostSummary.css";

interface IAuthorHostSummaryProps {
	id: number;
	name: string;
	imagePath?: string | null;
	topics: Partial<Topic>[];
}

export default class AuthorHostSummary extends React.Component<IAuthorHostSummaryProps> {
	public render(): JSX.Element {
		return (
			<div id="host-summary">
				<Link to={`/p/${this.props.id}`} className="no-link">
					<LargeProfileSummary
						imagePath={this.props.imagePath}
						name={this.props.name}
					/>
				</Link>
				<hr />
				<div id="host-summary-topics-container">
					<h4>Topics</h4>
					<Items
						monospace
						items={this.props.topics}
						leadingChar="#"
					/>
				</div>
			</div>
		);
	}
}
