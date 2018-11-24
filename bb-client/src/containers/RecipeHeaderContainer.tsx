// tslint:disable: no-unsafe-any
import React from "react";
import { Badge } from "reactstrap";
import Items from "../components/Items";
import Allergy from "../entities/Allergy";
import Tag from "../entities/Tag";
import "./resources/css/ProfileHeaderContainer.css";
import "./resources/css/RecipeHeaderContainer.css";

const months: string[] = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
	"Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

interface IRecipeHeaderProps {
	name: string;
	description?: string;
	tagList: Partial<Tag>[];
	imagePath?: string;
	createdAt: Date;
	updatedAt?: Date;
	reviewAverage: number;
	timesFavorited: number;
	allergies: Partial<Allergy>[];
}

export default class RecipeHeaderContainer extends React.Component<IRecipeHeaderProps> {
	constructor(props: IRecipeHeaderProps) {
		super(props);

		this.renderTagList = this.renderTagList.bind(this);
		this.renderAllergyList = this.renderAllergyList.bind(this);
	}

	private renderTagList(): JSX.Element {
		if (this.props.tagList.length !== 0) {
			return (
				<div>
					<div id="recipe-header-sub-title">Tags</div>
					<Items
						items={this.props.tagList}
						displayInline={true}
						leadingChar="#"
						monospace={true}
					/>
				</div>
			);
		}

		return (
			// TODO: Only display if current user is owner of this page
			<div>
				That's weird, there are no tags associated. 🤷‍
			</div>
		);
	}

	private renderAllergyList(): JSX.Element {
		if (this.props.allergies.length !== 0) {
			return (
				<div>
					<div id="recipe-header-sub-title">Potential Allergies</div>
					<Items
						items={this.props.allergies}	// Rendering using tag list. Should not need a function TODO: Maybe make independent
						displayInline={true}
						leadingChar=""
					/>
				</div>
			);
		}

		return (
			<div>
				That's weird, there are no allergies associated. 🤷‍ Please look over the ingredient list if you have any concerns.
			</div>
		);
	}

	public render(): JSX.Element {
		return (
			// TODO: Seperate to container and sub components
			<div id="recipe-header-container">
				<div id="recipe-header-component">
					<div id="recipe-header-card-left">
						<div>
							{
								this.props.imagePath === undefined ? undefined : (
									<img id="recipe-header-img" src={this.props.imagePath} alt="Profile Picture" />
								)
							}
							<div id="recipe-header-title">
								{this.props.name}
							</div>
							<span className="recipe-header-updated">Last updated on&nbsp;
								{
									this.props.updatedAt === undefined ? (
										months[this.props.createdAt.getMonth()], this.props.createdAt.toLocaleDateString(undefined, { year: "2-digit" })
									) : (
											months[this.props.updatedAt.getMonth()], this.props.updatedAt.toLocaleDateString(undefined, { year: "2-digit" })
										)
								}
							</span>
							{
								this.props.description === undefined ? undefined : (
									<div id="recipe-header-description">
										<p>{this.props.description}</p>
									</div>
								)
							}
							<div id="recipe-header-badges">
								<Badge className="recipe-header-badge-item" color="primary">
									⭐{parseFloat(this.props.reviewAverage.toFixed(2))}/5
								</Badge>
								<Badge className="recipe-header-badge-item" color="primary">
									❤️x{this.props.timesFavorited}
									{/* TODO: Add button to make favorite */}
								</Badge>
							</div>
						</div>
					</div>
					<div id="recipe-header-card-right">
						{this.renderTagList()}
						{this.renderAllergyList()}
					</div>
				</div>
			</div>
		);
	}
}
