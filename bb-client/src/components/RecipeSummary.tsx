import React from "react";
import { Link } from "react-router-dom";
import Tag from "../entities/Tag";
import User from "../entities/User";
import ItemTags from "./ItemTags";
import RecipeInfoFooter from "./RecipeInfoFooter";
import "./resources/css/RecipeSummary.css";
import { default as defaultMealPic } from "./resources/images/default_meal_pic.jpg";
import { default as defaultUserPic } from "./resources/images/default_user_pic.png";

interface IRecipeSummaryProps {
	id: number;
	author: Partial<User>;
	name: string;
	description: string;
	tags: Partial<Tag>[];
	imagePath?: string;
	timesSaved: number;
	showAuthor: boolean;
}

export default class RecipeSummary extends React.Component<IRecipeSummaryProps> {
	public render(): JSX.Element {
		return (
			<div id="recipe-summary-container">
				<hr className="recipe-summary-seperator" />
				<Link to={`/r/${this.props.id}`} className="no-link">
					<div id="recipe-summary" className="no-link">
						<img className="bg" src={this.props.imagePath || defaultMealPic} alt="Recipe Picture" />
						<div id="recipe-summary-info">
							<div id="recipe-summary-header">
								<div id="tags-title-container">
									<div id="recipe-summary-name">{this.props.name}</div>
									<ItemTags color="info" names={this.props.tags.map(tag => tag.name)} />
								</div>
								{this.props.showAuthor !== true
									? undefined
									: (
										<Link to={`/p/${this.props.author.id}`}>
											<div id="recipe-summary-author" className="no-link">
												<img id="recipe-summary-author-img" src={this.props.author.imagePath || defaultUserPic} alt="Author Picture" />
												<div id="recipe-summary-author-name">{`${this.props.author.firstName} ${this.props.author.lastName}`}</div>
											</div>
										</Link>
									)
								}
							</div>
							<div id="recipe-summary-description">PLACE HOLDER DESCRIPTION {this.props.description}</div>
							<RecipeInfoFooter timesSaved={this.props.timesSaved} />
						</div>
<<<<<<< HEAD
						{!this.props.showAuthor
							? undefined
							: (
								<Link to={`/p/${this.props.author.id}`}>
									<div id="recipe-summary-author" className="no-link">
										<img id="recipe-summary-author-img" src={this.props.author.imagePath || defaultUserPic} alt="Author Picture" />
										<div id="recipe-summary-author-name">{`${this.props.author.firstName} ${this.props.author.lastName}`}</div>
									</div>
								</Link>
							)
						}
=======
>>>>>>> css2
					</div>
				</Link>
			</div>
		);
	}
}
