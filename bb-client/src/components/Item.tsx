// tslint:disable: no-unsafe-any
import React from "react";
import "./resources/css/Item.css";

interface IItemProps {
	id: number;
	name: string;
	leadingChar?: string;
	monospace?: boolean;
	displayInline?: boolean;
}

export default class Item extends React.Component<IItemProps> {
	public render(): JSX.Element {
		let id = "item";
		if (this.props.displayInline === true) {
			id += "-inline";
		}
		let classes = "";
		if (this.props.monospace !== false) {
			classes += "monospace ";
		}

		return (
			<div id={id} className={classes}>{this.props.leadingChar}{this.props.name}</div>
		);
	}
}
