import React from "react";
import { Link } from "react-router-dom";
import User from "../entities/User";
import MealInfoFooter from "./MealInfoFooter";
import "./resources/css/UpcomingMealSummary.css";

interface IUpcomingMealSummaryProps {
	id: number;
	title: string;
	price: number;
	startTime: number;
	endTime: number;
	guests: Partial<User>[];
	maxGuests: number;
	location: string;
}

export default class UpcomingMealSummary extends React.Component<IUpcomingMealSummaryProps> {
	public render(): JSX.Element {
		return (
			<div id="upcoming-meal-summary">
				<div id="upcoming-meal-summary-header">
					<Link to={`/m/${this.props.id}`} className="no-link">
						{this.props.title}
					</Link>
				</div>
				<div id="upcoming-meal-summary-body">
					<MealInfoFooter
						price={this.props.price}
						numOfGuests={this.props.guests.length}
						maxGuests={this.props.maxGuests}
						startTime={this.props.startTime}
						endTime={this.props.endTime}
						location={this.props.location}
					/>
				</div>
			</div>
		);
	}
}
