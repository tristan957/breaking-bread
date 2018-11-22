import React from "react";
import { Badge } from "reactstrap";
import "./resources/css/MealQuickInfoFooter.css";

interface IMealQuickInfoFooterProps {
	price: number;
	numOfGuests: number;
	maxGuests: number;
	date: Date;
	location: string;
}

export default class MealQuickInfoFooter extends React.Component<IMealQuickInfoFooterProps> {
	public render(): JSX.Element {
		return (
			<div className="info-footer">
				<Badge className="info-footer-item" color="primary">📅 {`${this.props.date.toLocaleDateString()} @ ${this.props.date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`}</Badge>
				<Badge className="info-footer-item" color="secondary">🗺️ {this.props.location}</Badge>
				<Badge className="info-footer-item" color="success">💵 {this.props.price === 0 ? "Free" : `$${this.props.price}`}</Badge>
				<Badge className="info-footer-item" color="warning">#️⃣ {`${this.props.numOfGuests}/${this.props.maxGuests}`}</Badge>
			</div>
		);
	}
}
