import React from "react";
import Topic from "../entities/Topic";
import Items from "./Items";
import LargeProfileSummary from "./LargeProfileSummary";
import "./resources/css/CreatorSummary.css";

interface ICreatorSummaryProps {
	userID: number;
	viewerID?: number;
	name: string;
	imagePath?: string | null;
	topics: Partial<Topic>[];
}

export default class CreatorSummary extends React.Component<ICreatorSummaryProps> {
	public render(): JSX.Element {
		return (
			<div id="creator-summary">
				<LargeProfileSummary
					viewerID={this.props.viewerID}
					userID={this.props.userID}
					imagePath={this.props.imagePath}
					name={this.props.name}
				/>
				<hr />
				<div id="creator-summary-topics-container">
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
