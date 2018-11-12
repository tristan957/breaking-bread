import React from "react";
import { Link } from "react-router-dom";
import User from "../../../entities/User";
import "../../resources/css/UpcomingMealsCard.css";

export interface IUpcomingMealProps {
	id: number;
	title: string;
	price: number;
	date: Date;
	guests: Partial<User>[];
	maxGuests: number;
	location: string;
}

export default class UpcomingMeal extends React.Component<IUpcomingMealProps> {
	public render(): JSX.Element {
		return (
			<Link to={`/m/${this.props.id}`}>
				<div>
					<div id="UpcomingMealHeader">
						<h5>{this.props.title}</h5><h6> - {`${this.props.guests.length}/${this.props.maxGuests} 👨`}</h6>
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
