import React from "react";
import { Link } from "react-router-dom";
import User from "../../entities/User";
import "../../resources/css/UpcomingMealCard.css";

interface IUpcomingMealCardProps {
	id: number;
	title: string;
	price: number;
	date: Date;
	guests: Partial<User>[];
	maxGuests: number;
	location: string;
}

export default class UpcomingsMealCard extends React.Component<IUpcomingMealCardProps> {
	public render(): JSX.Element {
		return (
			<Link to={`/m/${this.props.id}`} className="no-link">
				<div className="upcomingMeal no-link">
					<div id="upcomingMealCardHeader">
						<h5>{this.props.title}</h5>
					</div>
					<div>
						<h6>
							{this.props.location} - {this.props.price === undefined ? `Free!` : `$${this.props.price}`}
							<br />
							{`${this.props.date.toLocaleDateString()} at ${this.props.date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`}
						</h6>
					</div>
				</div>
			</Link>
		);
	}
}
