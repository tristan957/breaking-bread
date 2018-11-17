// tslint:disable: no-unsafe-any
import React from "react";
import { Link } from "react-router-dom";
import User from "../entities/User";
import MealQuickInfoFooter from "./MealQuickInfoFooter";
import "./resources/css/MealSummary.css";
import { default as defaultImagePic } from "./resources/images/default_meal_pic.jpg";
import { default as defaultUserPic } from "./resources/images/default_user_pic.png";

export interface IMealSummaryProps {
	id: number;
	location: string;
	imagePath?: string;
	title: string;
	description: string;
	host: User;
	date: Date;
	guests: Partial<User>[];
	maxGuests: number;
	price: number;
	showHost?: boolean;
}

export default class MealSummary extends React.Component<IMealSummaryProps> {
	public render(): JSX.Element {
		return (
			<Link to={`/m/${this.props.id}`} className="no-link">
				<div className="no-link">
					<img src={this.props.imagePath || defaultImagePic} className="bg" />
					<div id="meal-summary-header">
						<div>
							<div id="meal-summary-title">{this.props.title}</div>
							<div id="meal-tags">

							</div>
						</div>
						{this.props.showHost !== true
							? undefined
							: (
								<Link to={`/p/${this.props.host.id}`}>
									<div id="host" className="no-link">
										<img src={this.props.host.imagePath || defaultUserPic} alt="Host Picture" id="host-img" />
										<div id="host-name">{`${this.props.host.firstName} ${this.props.host.lastName}`}</div>
									</div>
								</Link>
							)
						}
					</div>
					<div id="meal-summary-description">{this.props.description}</div>
					<MealQuickInfoFooter
						price={this.props.price}
						numOfGuests={this.props.guests.length}
						maxGuests={this.props.maxGuests}
						date={this.props.date}
						location={this.props.location}
					/>
				</div>
			</Link>
		);
	}
}
