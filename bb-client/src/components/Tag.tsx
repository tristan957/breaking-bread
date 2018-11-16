// tslint:disable: no-unsafe-any
import React from "react";
import "./resources/css/Tag.css";

interface ITagProps {
	id: number;
	name: string;
}

export default class Tag extends React.Component<ITagProps> {
	public render(): JSX.Element {
		return (
			<div id="tag" className="monospace">#{this.props.name}</div>
		);
	}
}
