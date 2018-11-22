// tslint:disable: no-unsafe-any
import React from "react";
import { Link } from "react-router-dom";
import Recipe from "../entities/Recipe";
import User from "../entities/User";
import ItemTags from "./ItemTags";
import MealInfoFooter from "./MealInfoFooter";
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
	recipes: Partial<Recipe>[];
	showHost?: boolean;
}

export default class MealSummary extends React.Component<IMealSummaryProps> {
	private getTagNames = (): (string | undefined)[] => {
		const tags = this.props.recipes.map(recipe => recipe.tags!.map(tag => tag.name));
		if (tags.length === 0) {
			return [];
		}
		return Array.from(new Set(tags.reduce((prev, val) => prev.concat(val))));
	}

	public render(): JSX.Element {
		return (
			<Link to={`/m/${this.props.id}`} className="no-link">
				<div id="meal-summary" className="no-link">
					<img src={this.props.imagePath || defaultImagePic} className="bg" />
					<div id="meal-summary-header">
						<div id="meal-summary-tags-title-container">
							<div id="meal-summary-title">{this.props.title}</div>
							<ItemTags color="info" names={this.getTagNames()} />
						</div>
						{this.props.showHost !== true
							? undefined
							: (
								<Link to={`/p/${this.props.host.id}`}>
									<div id="meal-summary-host" className="no-link">
										<img src={this.props.host.imagePath || defaultUserPic} alt="Host Picture" id="meal-summary-host-img" />
										<div id="meal-summary-host-name">{`${this.props.host.firstName} ${this.props.host.lastName}`}</div>
									</div>
								</Link>
							)
						}
					</div>
					<div id="meal-summary-description">TODO PLACE HOLDER DESCRIPTION</div>
					<MealInfoFooter
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
