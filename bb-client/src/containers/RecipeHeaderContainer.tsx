// tslint:disable: no-unsafe-any
import React from "react";
import { Badge } from "reactstrap";
import ItemTags from "../components/ItemTags";
import Allergy from "../entities/Allergy";
import Tag from "../entities/Tag";
import "./resources/css/ProfileHeaderContainer.css";
import "./resources/css/RecipeHeaderContainer.css";
import { default as defaultMealPic } from "./resources/images/default_meal_pic.jpg";

const months: string[] = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
	"Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

interface IRecipeHeaderProps {
	name: string;
	tagList: Partial<Tag>[];
	imagePath?: string;
	createdAt: number;
	updatedAt?: number;
	reviewAverage: number;
	timesFavorited: number;
	allergies: Partial<Allergy>[];
}

export default class RecipeHeaderContainer extends React.Component<IRecipeHeaderProps> {
	private getDate(joinedAt: number): Date {
		return new Date(joinedAt);
	}

	public render(): JSX.Element {
		return (
			// TODO: Seperate to container and sub components
			<div id="recipe-header-container">
				<div id="recipe-header-component">
					{
						this.props.imagePath === null ?
							(
								<img src={defaultMealPic} id="recipe-header-img" alt="Recipe Picture" />
							) : (
								<img src={this.props.imagePath || defaultMealPic} id="recipe-header-img" alt="Recipe Picture" />
							)
					}
					<div id="recipe-header-information">
						<div id="recipe-header-card-left">
							<h1 id="recipe-header-name">
								{this.props.name}
							</h1>
							<span className="recipe-header-updated">Last updated on
								{
									this.props.updatedAt === undefined
										? (
											months[this.getDate(this.props.createdAt).getMonth()], this.getDate(this.props.createdAt).toLocaleDateString(undefined, { year: "2-digit" })
										)
										: (
											months[this.getDate(this.props.updatedAt).getMonth()], this.getDate(this.props.updatedAt).toLocaleDateString(undefined, { year: "2-digit" })
										)
								}
							</span>
							<div id="recipe-header-badges">
								<Badge className="recipe-header-badge-item" color="primary">
									⭐ {parseFloat(this.props.reviewAverage.toFixed(2))}/5
									</Badge>
								<Badge className="recipe-header-badge-item" color="primary">
									❤️ {this.props.timesFavorited}
									{/* TODO: Add button to make favorite */}
								</Badge>
							</div>
						</div>
						<div id="recipe-header-card-right">
							<div id="recipe-header-tags">
								Tags
								<ItemTags color="info" names={this.props.tagList.map(tag => tag.name)} />
							</div>
							<div id="recipe-header-allergies">
								Allergies
								<ItemTags color="warning" names={this.props.allergies.map(allergy => allergy.name)} />
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}
