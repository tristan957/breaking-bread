import React from "react";
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
				<span className="info-footer-item">📅 {`${this.props.date.toLocaleDateString()} @ ${this.props.date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`}</span>
				<span className="info-footer-item">🗺️ {this.props.location}</span>
				<span className="info-footer-item">💵 {this.props.price === 0 ? "Free" : `$${this.props.price}`}</span>
				<span className="info-footer-item">#️⃣ {`${this.props.numOfGuests}/${this.props.maxGuests}`}</span>
			</div>
		);
	}
}
