// Meal article is like the dashboard feed. Consists of image, title, tags, desc., recipes.
import React from "react";
import RecipeSummariesContainer from "../containers/RecipeSummariesContainer";
import Meal from "../entities/Meal";
import MealModification from "./MealModification";
import { default as defaultImagePic } from "./resources/images/default_meal_pic.jpg";

interface IMealDescriptionProps {
	meal: Partial<Meal>;
	isGuest: boolean | undefined;
	setMeal: undefined | ((
		startTime?: number,
		endTime?: number,
		title?: string,
		location?: string,
		description?: string
	) => void);
}

export default class MealDescription extends React.Component<IMealDescriptionProps> {
	public render(): JSX.Element {
		return (
			// TODO: Edit link to editMealPage if current user is the meal host
			<div>
				<div className="card">
					{
						this.props.meal.imagePath === null ?
							(
								<img src={defaultImagePic} className="bg" />
							) : (
								<img src={this.props.meal.imagePath || defaultImagePic} className="bg" />
							)
					}
					<div className="articleMain">
						<div id="meal-article-header">
							<h2><b>{this.props.meal.title}</b></h2>
							<h5>
								<i>
									{this.props.meal.location} - {this.props.meal.price === undefined || this.props.meal.price === 0 ? `Free!` : `$${this.props.meal.price} per person`}
								</i>
							</h5>
							<h6>
								<i>
									{new Date(this.props.meal.startTime!).toLocaleDateString()} at {new Date(this.props.meal.startTime!).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
								</i>
							</h6>
							<hr className="seperator" />
							<h6>{this.props.meal.description}</h6>
							{(this.props.isGuest !== undefined && !this.props.isGuest && this.props.setMeal !== undefined) &&
								<MealModification meal={this.props.meal} setMeal={this.props.setMeal} />}
						</div>
					</div>
				</div>
				<div className="card">
					<div id="recipe-section">
						<h2><b>Recipes in {this.props.meal.title}</b></h2>
						<RecipeSummariesContainer recipes={this.props.meal.recipes || []} />
					</div>
					<div id="footer"></div>
				</div>
			</div>
		);
	}
}
