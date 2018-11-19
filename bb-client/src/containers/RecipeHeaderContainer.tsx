// Meal article is like the dashboard feed. Consists of image, title, tags, desc., recipes.
import React from "react";
import Tags from "../components/Tags";
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
}

export default class RecipeHeader extends React.Component<IRecipeHeaderProps> {
	constructor(props: IRecipeHeaderProps) {
		super(props);

	}

	private renderTagList(): JSX.Element {
		if (this.props.tagList.length !== 0) {
			return (
				<div>
					<div></div>
					<Tags
						tags={this.props.tagList}
						displayInline={true}
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
					</div>
				</div>
			</div>
		);
	}
}
