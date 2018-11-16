// Meal article is like the dashboard feed. Consists of image, title, tags, desc., recipes.
import React from "react";
import { default as defaultUserPic } from "../resources/images/default_user_pic.png";

interface IProfileHeaderProps {
	name: string;
	imagePath?: string;
	joinedAt: Date;
}

export default class MealArticle extends React.Component<IProfileHeaderProps> {
	public render(): JSX.Element {
		return (
			// TODO: Edit link to editMealPage if current user is the meal host
			<div className="header-card">
				<div className="header-card-container">
					<div id="username">
						<img id="ProfileHeaderImg" src={this.props.imagePath === undefined ? defaultUserPic : this.props.imagePath} alt="Profile Picture" />
						{this.props.name}
					</div>
				</div>
			</div>
		);
	}
}
