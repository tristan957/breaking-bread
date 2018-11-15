// tslint:disable: no-unsafe-any
import React from "react";
import { Link } from "react-router-dom";

interface IRecipeSummaryProps {
	id: number;
	name: string;
	description: string;
	imagePath?: string;
	timesFavorited: number;
}

export default class RecipeSummary extends React.Component<IRecipeSummaryProps> {
	public render(): JSX.Element {
		return (
			// TODO: Click to link to recipe
			// TODO: Add recipe card specific css
			<Link to={`/r/${this.props.id}`} className="no-link">
				<div id="profile-card" className="profile card no-link">
					<div id="name" className="profile">{this.props.name}</div>
					<div id="description" className="profile">{this.props.description}</div>
					<img id="picture" className="profile" src={this.props.imagePath} alt="Recipe Picture" />  {/* TODO: Consider recipe image deault */}
					<div>❤️x{this.props.timesFavorited}</div>
					{/* TODO: Maybe 😍 if the current user has this recipe in their favs (current user in context?)*/}
				</div>
			</Link>
		);
	}
}
