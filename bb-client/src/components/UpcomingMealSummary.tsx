import React from "react";
import { Link } from "react-router-dom";
import User from "../entities/User";
import "./resources/css/UpcomingMealSummary.css";

interface IUpcomingMealSummaryProps {
	id: number;
	title: string;
	price: number;
	date: Date;
	guests: Partial<User>[];
	maxGuests: number;
	location: string;
}

export default class UpcomingMealSummary extends React.Component<IUpcomingMealSummaryProps> {
	public render(): JSX.Element {
		return (
			<Link to={`/m/${this.props.id}`} className="no-link">
				<div className="no-link">
					<div id="upcoming-meal-summary-header">{this.props.title}</div>
					<div id="upcoming-meal-summary-body">
						<div>{`${this.props.location}`}</div>
						<div>{`${this.props.date.toLocaleDateString()} at ${this.props.date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`}</div>
						<div className="info-footer">
							<div>💵 {this.props.price === undefined || this.props.price === 0 ? "Free" : `$${this.props.price}`}</div>
							<div>#️⃣ {`${this.props.guests.length}/${this.props.maxGuests}`}</div>
						</div>
					</div>
				</div>
			</Link>
		);
	}
}
