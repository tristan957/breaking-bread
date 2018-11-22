import React from "react";
import { Badge } from "reactstrap";
import "./resources/css/MealTags.css";

interface IMealTagsProps {
	color: "primary" | "secondary" | "success" |
	"danger" | "warning" | "info" |
	"light" | "dark";
	names: (string | undefined)[];
}

export default class MealTags extends React.Component<IMealTagsProps> {
	public render(): JSX.Element {
		return (
			<div id="tags-container">
				{this.props.names.map(name => name === undefined
					? undefined
					: <Badge className="meal-tag-badge" color={this.props.color}>{name}</Badge>
				)}
			</div>
		);
	}
}
