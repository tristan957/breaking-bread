import React from "react";
import { Badge } from "reactstrap";
import "./resources/css/MealInfoFooter.css";

interface IMealInfoFooterProps {
	price: number;
	numOfGuests: number;
	maxGuests: number;
	date: Date;
	location: string;
}

export default class MealInfoFooter extends React.Component<IMealInfoFooterProps> {
	public render(): JSX.Element {
		return (
			<div className="meal-info-footer">
				<Badge className="meal-info-footer-item" color="primary">📅 {`${this.props.date.toLocaleDateString()} @ ${this.props.date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`}</Badge>
				<Badge className="meal-info-footer-item" color="secondary">🗺️ {this.props.location}</Badge>
				<Badge className="meal-info-footer-item" color="success">💵 {this.props.price === 0 ? "Free" : `$${this.props.price}`}</Badge>
				<Badge className="meal-info-footer-item" color="warning">#️⃣ {`${this.props.numOfGuests}/${this.props.maxGuests}`}</Badge>
			</div>
		);
	}
}
