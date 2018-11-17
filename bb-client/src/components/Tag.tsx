// tslint:disable: no-unsafe-any
import React from "react";
import "./resources/css/Tag.css";

interface ITagProps {
	id: number;
	name: string;
	displayInline?: boolean;
}

export default class Tag extends React.Component<ITagProps> {
	public render(): JSX.Element {
		let id = "tag";
		if (this.props.displayInline === true) {
			id += "-inline";
		}
		return (
			<div id={id} className="monospace">#{this.props.name}</div>
		);
	}
}
