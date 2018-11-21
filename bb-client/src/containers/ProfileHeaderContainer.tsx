// Meal article is like the dashboard feed. Consists of image, title, tags, desc., recipes.
import React from "react";
import Rating from "react-rating";
import { Button } from "reactstrap";
import Topic from "../entities/Topic";
import "./resources/css/ProfileHeaderContainer.css";
import { default as defaultUserPic } from "./resources/images/default_user_pic.png";

interface IProfileHeaderProps {
	name: string;
	about?: string;
	whiteList: Partial<Topic>[];
	blackList: Partial<Topic>[];
	imagePath?: string;
	joinedAt: Date;
	reviewAverage: number;
	timesFavorited: number;
}

export default class ProfileHeader extends React.Component<IProfileHeaderProps> {
	public render(): JSX.Element {
		return (
			<div id="profile-header-container" className="card">
				<div id="profile-header-left-container">
					<img id="profile-picture" src={this.props.imagePath || defaultUserPic} alt="Profile Picture" />
					<div id="profile-name">{this.props.name}</div>
					<Rating
						fractions={2}
						readonly
						initialRating={this.props.reviewAverage}
					/>
					<div>
						<Button>Follow</Button>
					</div>
				</div>
				<div id="profile-header-right-container">
					<div id="profile-header-about-container">
						<p id="profile-header-about">Your moom</p>
					</div>
					<div id="profile-header-joined">Joined {this.props.joinedAt.getMonth()}/{this.props.joinedAt.getDate()}/{this.props.joinedAt.getFullYear()}</div>
				</div>
			</div>
		);
	}
}
