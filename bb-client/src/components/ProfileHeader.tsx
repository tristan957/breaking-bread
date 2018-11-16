// Meal article is like the dashboard feed. Consists of image, title, tags, desc., recipes.
import React from "react";
import "./resources/css/ProfileHeader.css";
import { default as defaultUserPic } from "./resources/images/default_user_pic.png";

interface IProfileHeaderProps {
	name: string;
	imagePath?: string;
	joinedAt: Date;
}

export default class ProfileHeader extends React.Component<IProfileHeaderProps> {
	public render(): JSX.Element {
		return (
			// TODO: Edit link to editMealPage if current user is the meal host
			// TODO: Seperate to container and sub components
			<div id="header-container" className="card">
				<div id="header-component">
					<div id="header-card-left">
						<div id="username">
							<img id="profile-header-img" src={this.props.imagePath === undefined ? defaultUserPic : this.props.imagePath} alt="Profile Picture" />
							{this.props.name}
						</div>
					</div>
					<div id="header-card-right">
						<div id="username">
							<img id="profile-header-img" src={this.props.imagePath === undefined ? defaultUserPic : this.props.imagePath} alt="Profile Picture" />
							{this.props.name}
						</div>
					</div>
				</div>
			</div>
		);
	}
}
