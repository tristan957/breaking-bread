import React from "react";
import { Badge } from "reactstrap";
import "./resources/css/RecipeInfoFooter.css";

interface IRecipeInfoFooterProps {
	timesSaved: number;
}

export default class RecipeInfoFooter extends React.Component<IRecipeInfoFooterProps> {
	public render(): JSX.Element {
		return (
			<div className="recipe-info-footer">
				<Badge className="recipe-info-footer-item" color="primary">❤️ {this.props.timesSaved}</Badge>
			</div>
		);
	}
}
