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
	price?: number;
}

export default class MealCard extends React.Component<IMealCardProps> {
	public render(): JSX.Element {
		return (
			<Link to={`/m/${this.props.id}`}>
				<div>
					<img src={this.props.imagePath || defaultImagePic} />
					<div className="meal-card-header">
						<div className="meal-card-title">{this.props.title}</div>
						<div className="meal-card-location">{this.props.location}</div>
						<Link to={`/p/${this.props.host.id}`}>
							<div className="host">
								<div>
									<img src={this.props.host.imagePath || defaultUserPic} alt="Host Picture" id="HostImg" /> {`${this.props.host.firstName} ${this.props.host.lastName}`}
								</div>
							</div>
						</Link>
						<div className="meal-card-footer">
							<div className="meal-card-description">{this.props.description}</div>
							<div className="meal-card-guest-count">{`${this.props.guests.length}/${this.props.numberOfGuests} 👨`}</div>
							<div>
								{
									this.props.price === undefined ? `Free!` : (
										`$${this.props.price} per person`
									)
								}
							</div>
						</div>
					</div>
				</div>
			</Link>
		);
	}
}

// export default withRouter(MealCard);
