// tslint:disable: no-unsafe-any
import React from "react";
import "./resources/css/Topic.css";

interface ITopicProps {
	id: number;
	name: string;
	displayInline?: boolean;
}

export default class Topic extends React.Component<ITopicProps> {
	public render(): JSX.Element {
		let id = "topic";
		if (this.props.displayInline === true) {
			id += "-inline";
		}
		return (
			<div id={id} className="monospace">#{this.props.name}</div>
		);
	}
}
