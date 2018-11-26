import React from "react";
import { Badge, Button } from "reactstrap";
import Allergy from "../entities/Allergy";
import Tag from "../entities/Tag";
import ItemTags from "./ItemTags";
import "./resources/css/RecipeSummary.css";
import { default as defaultMealPic } from "./resources/images/default_meal_pic.jpg";

const months: string[] = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
	"Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

interface IRecipeSummaryProps {
	name: string;
	tags: Partial<Tag>[];
	imagePath?: string | null;
	createdAt: number;
	updatedAt: number;
	reviewAverage: number;
	timesSaved: number;
	allergies: Partial<Allergy>[];
	showAuthor?: boolean;
}

export default class RecipeSummary extends React.Component<IRecipeSummaryProps> {
	public render(): JSX.Element {
		return (
			<div id="recipe-summary">
				<img src={this.props.imagePath || defaultMealPic} id="recipe-summary-img" alt="Recipe Picture" />
				<div id="recipe-summary-information">
					<div id="recipe-summary-left">
						<h1 id="recipe-summary-name">
							{this.props.name}
						</h1>
						<span className="recipe-summary-updated">Last updated on
							{` ${new Date(this.props.updatedAt).toLocaleDateString()}`}
							{console.log(this.props.updatedAt)}
						</span>
						<div id="recipe-summary-badges">
							<Badge className="recipe-summary-badge-item" color="primary">
								⭐ {parseFloat(this.props.reviewAverage.toFixed(2))}/5
							</Badge>
							<Badge className="recipe-summary-badge-item" color="primary">
								❤️ {this.props.timesSaved}
							</Badge>
						</div>
						<div id="recipe-summary-buttons">
							<Button outline color="secondary" className="recipe-summary-action">Review</Button>
							<Button outline color="secondary" className="recipe-summary-action">Save</Button>
						</div>
					</div>
					<div id="recipe-summary-card-right">
						<div id="recipe-summary-tags">
							Tags
							<ItemTags color="info" names={this.props.tags.map(tag => tag.name)} />
						</div>
						<div id="recipe-summary-allergies">
							Allergies
							<ItemTags color="warning" names={this.props.allergies.map(allergy => allergy.name)} />
						</div>
					</div>
				</div>
			</div>
		);
	}
}
