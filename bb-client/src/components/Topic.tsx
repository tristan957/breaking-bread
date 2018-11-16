// tslint:disable: no-unsafe-any
import React from "react";
import "./resources/css/Topic.css";

interface ITopicProps {
	id: number;
	name: string;
}

export default class Topic extends React.Component<ITopicProps> {
	public render(): JSX.Element {
		return (
			<div id="topic" className="monospace">#{this.props.name}</div>
		);
	}
}
