// Meal article is like the dashboard feed. Consists of image, title, tags, desc., recipes.
import React from "react";
import Rating from "react-rating";
import { Button } from "reactstrap";
import Items from "../components/Items";
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
	constructor(props: IProfileHeaderProps) {
		super(props);

		this.renderWhiteList = this.renderWhiteList.bind(this);
		this.renderBlackList = this.renderBlackList.bind(this);
	}

	private renderWhiteList(): JSX.Element {
		if (this.props.whiteList.length !== 0) {
			return (
				<div>
					<div>Favorite topics</div>
					<Items
						items={this.props.whiteList}
						displayInline={true}
						leadingChar="#"
					/>
				</div>
			);
		}

		return (
			// TODO: Only display if current user is owner of this page
			<div>
				Nada! Try clicking on topics you like to and then add them to your favorites.
			</div>
		);
	}

	private renderBlackList(): JSX.Element {
		if (this.props.blackList.length !== 0) {
			return (
				<div>
					<div>Least favorite topics</div>
					<Items
						items={this.props.blackList}
						displayInline={true}
						leadingChar="#"
					/>
				</div>
			);
		}

		return (
			// TODO: Only display if current user is owner of this page
			<div>
				Nada! If you don't care for a topic, try selecting it and adding it to your disliked.
			</div>
		);
	}

	public render(): JSX.Element {
		return (
			<div id="profile-header-container" className="card">
				<div id="profile-header-left-container">
					<img id="profile-picture" src={this.props.imagePath || defaultUserPic} alt="Profile Picture" />
					<div id="profile-name">{this.props.name}</div>
					<div>
						<Button>Follow</Button>
					</div>
				</div>
				<div id="profile-header-right-container">
					<div>Joined {this.props.joinedAt.getMonth()}/{this.props.joinedAt.getDate()}/{this.props.joinedAt.getFullYear()}</div>
					<Rating
						fractions={2}
						readonly
						initialRating={this.props.reviewAverage}
					/>
				</div>
			</div>
		);
	}
}
