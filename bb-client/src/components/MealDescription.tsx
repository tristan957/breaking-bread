// Meal article is like the dashboard feed. Consists of image, title, tags, desc., recipes.
import React from "react";
import Meal from "../entities/Meal";
import RecipeSummaries from "./RecipeSummaries";
import { default as defaultImagePic } from "./resources/images/default_meal_pic.jpg";

interface IMealDescriptionProps {
	meal: Partial<Meal>;
}

export default class MealDescription extends React.Component<IMealDescriptionProps> {
	public render(): JSX.Element {
		return (
			// TODO: Edit link to editMealPage if current user is the meal host
			<div className="card">
				<img src={this.props.meal.imagePath || defaultImagePic} className="bg" />
				<div className="articleMain">
					<div id="meal-article-header">
						<h3><b>{this.props.meal.title}</b></h3>
						<h5>
							<i>
								{this.props.meal.location} - {this.props.meal.price === undefined ? `Free!` : `$${this.props.meal.price} per person`}
							</i>
						</h5>
						{
							this.props.meal.date === undefined ? undefined : (
								<h6>
									<i>
										{this.props.meal.date.toLocaleDateString()} at {this.props.meal.date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
									</i>
								</h6>
							)
						}
						<h6>{this.props.meal.description}</h6>
					</div>
					<hr className="seperator" />
					<div id="recipe-section">
						<RecipeSummaries recipes={this.props.meal.recipes || []} />
					</div>
					<div id="footer"></div>
				</div>
			</div>
		);
	}
}
