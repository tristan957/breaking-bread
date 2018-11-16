// Meal article is like the dashboard feed. Consists of image, title, tags, desc., recipes.
import React from "react";
import Topic from "../entities/Topic";
import "./resources/css/ProfileHeader.css";
import { default as defaultUserPic } from "./resources/images/default_user_pic.png";
import Topics from "./Topics";

const months: string[] = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
	"Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

interface IProfileHeaderProps {
	name: string;
	about?: string;
	whiteList: Partial<Topic>[];
	blackList: Partial<Topic>[];
	imagePath?: string;
	joinedAt: Date;
	reviewAverage: number;
}

export default class ProfileHeader extends React.Component<IProfileHeaderProps> {
	constructor(props: IProfileHeaderProps) {
		super(props);

		this.renderWhiteList = this.renderWhiteList.bind(this);
	}

	private renderWhiteList(): JSX.Element {
		if (this.props.whiteList.length !== 0) {
			return (
				<Topics topics={this.props.whiteList} />
			);
		}

		return (
			<div>
				Nada! Try clicking on topics you like to and then add them to your favorites.
			</div>
		);
	}

	private renderBlackList(): JSX.Element {
		if (this.props.blackList.length !== 0) {
			return (
				<Topics topics={this.props.blackList} />
			);
		}

		return (
			<div>
				Nada! If you don't care for a topic, try selecting it and adding it to your disliked.
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
							<img id="profile-header-img" src={this.props.imagePath === undefined ? defaultUserPic : this.props.imagePath} alt="Profile Picture" />
							{this.props.name}
							{
								this.props.about === undefined ? undefined : (
									<div>
										About
										<p>{this.props.about}</p>
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
							Member since {months[this.props.joinedAt.getMonth()]}, {this.props.joinedAt.toLocaleDateString(undefined, { year: "2-digit" })}
						</div>
						{this.renderWhiteList()}
						{this.renderBlackList()}
					</div>
				</div>
			</div>
		);
	}
}
