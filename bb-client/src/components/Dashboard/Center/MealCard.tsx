// tslint:disable: no-unsafe-any
import React from "react";
import { Link } from "react-router-dom";
import User from "../../../entities/User";
import { default as defaultImagePic } from "../../resources/images/default_meal_pic.jpg";
import { default as defaultUserPic } from "../../resources/images/default_user_pic.png";

export interface IMealCardProps {
	id: number;
	location: string;
	imagePath?: string;
	title: string;
	description: string;
	host: User;
	date: Date;
	guests: Partial<User>[];
	numberOfGuests: number;
}

export default class MealCard extends React.Component<IMealCardProps> {
	public render(): JSX.Element {
		return (
			<Link to={`/${this.props.host.id}/${this.props.id}`}>
				<div>
					<img src={this.props.imagePath || defaultImagePic} />
					<div className="meal-card-header">
						<div className="meal-card-title">{this.props.title}</div>
						<div className="meal-card-location">{this.props.location}</div>
						<div className="host">
							<img src={this.props.host.imagePath || defaultUserPic} alt="Host Picture" id="HostImg" />
							<div>TODO: Get Host Name from host ID</div>
						</div>
						<div className="meal-card-footer">
							<div className="meal-card-description">{this.props.description}</div>
							<div className="meal-card-guest-count">{`${this.props.guests.length}/${this.props.numberOfGuests} 👨`}</div>
						</div>
					</div>
				</div>
			</Link>
		);
	}
}

// export default withRouter(MealCard);
