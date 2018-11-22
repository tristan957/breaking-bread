import React from "react";
import { Link } from "react-router-dom";
import User from "../entities/User";
import MealInfoFooter from "./MealInfoFooter";
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
				<div id="upcoming-meal-summary" className="no-link">
					<div id="upcoming-meal-summary-header">{this.props.title}</div>
					<div id="upcoming-meal-summary-body">
						<MealInfoFooter
							price={this.props.price}
							numOfGuests={this.props.guests.length}
							maxGuests={this.props.maxGuests}
							date={this.props.date}
							location={this.props.location}
						/>
					</div>
				</div>
			</Link>
		);
	}
}
