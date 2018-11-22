import React from "react";
import { Badge } from "reactstrap";
import "./resources/css/ItemTags.css";

interface IItemTagsProps {
	color: "primary" | "secondary" | "success" |
	"danger" | "warning" | "info" |
	"light" | "dark";
	names: (string | undefined)[];
}

export default class ItemTags extends React.Component<IItemTagsProps> {
	public render(): JSX.Element {
		return (
			<div id="item-tags-container">
				{this.props.names.map((name, i) => name === undefined
					? undefined
					: <Badge key={i} className="item-tag-badge" color={this.props.color}>{name}</Badge>
				)}
			</div>
		);
	}
}
