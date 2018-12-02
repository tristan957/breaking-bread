// tslint:disable: no-unsafe-any
import React from "react";
import { Link } from "react-router-dom";
import Recipe from "../entities/Recipe";
import User from "../entities/User";
import ItemTags from "./ItemTags";
import MealInfoFooter from "./MealInfoFooter";
import "./resources/css/MealSummary.css";
import { default as defaultMealPic } from "./resources/images/default_meal_pic.jpg";
import { default as defaultUserPic } from "./resources/images/default_user_pic.png";

export interface IMealSummaryProps {
	id: number;
	city: string;
	imagePath?: string | null;
	title: string;
	description: string;
	host: Partial<User>;
	startTime: number;
	endTime: number;
	guests: Partial<User>[];
	maxGuests: number;
	price: number;
	recipes: Partial<Recipe>[];
	showHost?: boolean;
}

export default class MealSummary extends React.Component<IMealSummaryProps> {
	private getTagNames = (): (string | undefined)[] => {
		const tags = this.props.recipes.map(recipe => recipe.tags!.map(tag => `#${tag.name}`));
		if (tags.length === 0) {
			return [];
		}
		return Array.from(new Set(tags.reduce((prev, val) => prev.concat(val))));
	}

	public render(): JSX.Element {
		return (
			<div id="meal-summary">
				{
					this.props.imagePath === null ?
						(
							<img src={defaultMealPic} className="bg" />
						) : (
							<img src={this.props.imagePath || defaultMealPic} className="bg" />
						)
				}
				<div id="meal-summary-header">
					<div id="meal-summary-tags-title-container">
						<Link to={`/m/${this.props.id}`} className="black-link-with-underline">
							<div id="meal-summary-title">{this.props.title}</div>
						</Link>
						<ItemTags color="info" names={this.getTagNames()} />
					</div>
					{this.props.showHost !== true
						? undefined
						: (
							<div id="meal-summary-host" className="black-link-with-underline">
								<img src={this.props.host.imagePath || defaultUserPic} alt="Host Picture" id="meal-summary-host-img" />
								<div id="meal-summary-host-name">
									<Link to={`/p/${this.props.host.id}`} className="black-link-with-underline">
										{this.props.host.name}
									</Link>
								</div>
							</div>
						)
					}
				</div>
				<div id="meal-summary-description">{/* TODO PLACE HOLDER DESCRIPTION */}</div>
				<MealInfoFooter
					price={this.props.price}
					numOfGuests={this.props.guests.length}
					maxGuests={this.props.maxGuests}
					startTime={this.props.startTime}
					endTime={this.props.endTime}
					city={this.props.city}
				/>
			</div>
		);
	}
}
