// tslint:disable: no-unsafe-any
import React from "react";

interface ITopicCardProps {
	id: number;
	name: string;
}

export default class TopicCard extends React.Component<ITopicCardProps> {
	public render(): JSX.Element {
		return (
			// TODO: Click to filter topic?
			// TODO: Show x to unfollow/toggle modal
			// TODO: If shown and followed (show x to unfollow) if shown and not followed (show + to follow)
			<div id="topic-card" className="topic">
				<div id="topic" className="topic">#{this.props.name}</div>
			</div>
		);
	}
}
