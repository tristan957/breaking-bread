// tslint:disable: no-unsafe-any
import React from "react";
import { Link } from "react-router-dom";

interface IRecipeSummaryCardProps {
	id: number;
	name: string;
	description: string;
	imagePath?: string;
	timesFavorited: number;
}

export default class RecipeSummaryCard extends React.Component<IRecipeSummaryCardProps> {
	public render(): JSX.Element {
		return (
			// TODO: Click to link to recipe
			// TODO: Add recipe card specific css
			<Link to={`/r/${this.props.id}`} className="no-link">
				<div id="profile-card" className="profile card no-link">
					<div id="name" className="profile">{this.props.name}</div>
					<div id="description" className="profile">{this.props.description}</div>
					<img id="picture" className="profile" src={this.props.imagePath} alt="Recipe Picture" />  {/* TODO: Consider recipe image deault */}
					{
						(this.props.timesFavorited === 0 || this.props.timesFavorited === undefined) ? undefined : (
							/* TODO: Maybe 😍 if the current user has this recipe in their favs (current user in context?)*/
							<div>❤️x{this.props.timesFavorited}</div>
						)
					}
				</div>
			</Link>
		);
	}
}
