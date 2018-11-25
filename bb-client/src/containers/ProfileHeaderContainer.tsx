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
	joinedAt: number;
	reviewAverage: number;
	numberOfFollowers: number;
}

export default class ProfileHeader extends React.Component<IProfileHeaderProps> {
	public render(): JSX.Element {
		return (
			<div id="profile-header-container" className="card">
				<div id="profile-header-left-container">
					<img id="profile-header-picture" src={this.props.imagePath || defaultUserPic} alt="Profile Picture" />
					<div id="profile-header-name">{this.props.name}</div>
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
						<p id="profile-header-about">This is why folks still use tables for grid layout. Vertical align (or anything with height & dynamic data) can be challenging with pure CSS. You have to be willing to do weird hacks like this (somewhat defeats the "separating content from layout" idea), or take the multi-pass rendering hit and use non-static tables. I've never once had complaints from end users for table despite that I routinely break CSS fanboys' hearts. Most of em design only simple blogs & static sites. Some of us build business software and need dense data display, and our users care more about functionality.</p>
					</div>
					<div id="profile-header-joined">Joined {
						((joinedAt: number): string => {
							const date = new Date(joinedAt);
							return (
								`${date.getMonth()}/${date.getDate()}/${date.getFullYear()}`
							);
						})(this.props.joinedAt)
					}
					</div>
				</div>
			</div>
		);
	}
}
