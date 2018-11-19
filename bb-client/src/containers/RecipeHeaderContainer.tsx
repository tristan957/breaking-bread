// Meal article is like the dashboard feed. Consists of image, title, tags, desc., recipes.
import React from "react";
import Items from "../components/Items";
import Allergy from "../entities/Allergy";
import Tag from "../entities/Tag";
import "./resources/css/ProfileHeaderContainer.css";

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
					<div>Tags</div>
					<Items
						items={this.props.tagList}
						displayInline={true}
						leadingChar="#"
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
					<div>Potential Allergies</div>
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
			<div id="header-container" className="card">
				<div id="header-component">
					<div id="header-card-left">
						<div id="username">
							{
								this.props.imagePath === undefined ? undefined : (
									<img id="recipe-header-img" src={this.props.imagePath} alt="Profile Picture" />
								)
							}
							{this.props.name}
							{
								this.props.description === undefined ? undefined : (
									<div>
										Description
										<p>{this.props.description}</p>
									</div>
								)
							}
						</div>
					</div>
					<div id="header-card-right">
						<div id="username">
							⭐{parseFloat(this.props.reviewAverage.toFixed(2))}/5
							❤️x{this.props.timesFavorited} {/* TODO: Add button to make favorite */}
						</div>
						<div>
							Last updated
							{
								this.props.updatedAt === undefined ? (
									months[this.props.createdAt.getMonth()], this.props.createdAt.toLocaleDateString(undefined, { year: "2-digit" })
								) : (
										months[this.props.updatedAt.getMonth()], this.props.updatedAt.toLocaleDateString(undefined, { year: "2-digit" })
									)
							}
						</div>
						{this.renderTagList()}
						{this.renderAllergyList()}
					</div>
				</div>
			</div>
		);
	}
}
