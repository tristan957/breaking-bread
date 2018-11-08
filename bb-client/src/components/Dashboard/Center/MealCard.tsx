// tslint:disable: no-unsafe-any
import React from "react";
import defaultMealPic from "../../resources/images/default_meal_pic.jpg";
import defaultUserPic from "../../resources/images/default_user_pic.png";

export interface IMealCardProps {
	id: number;
	location: string;
	imagePath?: string;
	title: string;
	description: string;
	date: Date;
	guestIDs: number[];
	numberOfGuests: number;
}

export default class MealCard extends React.Component<IMealCardProps> {
	public render(): JSX.Element {
		return (
			<div>
				<img src={this.props.imagePath === undefined ? defaultMealPic : this.props.imagePath} />
				<div className="meal-card-header">
					<div className="meal-card-title">{this.props.title}</div>
					<div className="meal-card-location">{this.props.location}</div>
					<div className="host">
						<img src={defaultUserPic} alt="Host Picture" id="HostImg" />
						<div>TODO: Get Host Name from host ID</div>
					</div>
					<div className="meal-card-footer">
						<div className="meal-card-description">{this.props.description}</div>
						<div className="meal-card-guest-count">{`${this.props.guestIDs.length}/${this.props.numberOfGuests} 👨`}</div>
					</div>
				</div>
				<div></div>
			</div>
		);
	}
}
