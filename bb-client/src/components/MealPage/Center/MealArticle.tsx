// Meal article is like the dashboard feed. Consists of image, title, tags, desc., recipes.
import React from "react";
import Meal from "../../../entities/Meal";
import { default as defaultImagePic } from "../../resources/images/default_meal_pic.jpg";
import RecipeListSection from "./RecipeListSection";

interface IMealArticleProps {
	meal: Partial<Meal>;
}

export default class MealArticle extends React.Component<IMealArticleProps> {
	public render(): JSX.Element {
		return (
			// TODO: Edit link to editMealPage if current user is the meal host
			<div className="card">
				<div id="meal-article-header">
					<img src={this.props.meal.imagePath || defaultImagePic} />
					<h3>{this.props.meal.title}</h3>
					<h5>
						{
							this.props.meal.price === undefined ? `Free!` : (
								`$${this.props.meal.price} expected`
							)
						}
					</h5>
					<h6>{this.props.meal.description}</h6>
				</div>
				<hr className="seperator" />
				<div id="recipe-section">
					<RecipeListSection recipes={this.props.meal.recipes || []} />
				</div>
				<div id="footer">
				</div>
			</div>
		);
	}
}
