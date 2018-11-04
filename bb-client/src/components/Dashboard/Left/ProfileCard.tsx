import React from "react";
import "../../resources/css/ProfileCard.css";
import { default as defaultUserPic } from "../../resources/images/default_user_pic.png";

interface IProfileCardProps {
	userID: number;
	name: string;
	picturePath?: string;
}

export default class ProfileCard extends React.Component<IProfileCardProps> {
	public render(): JSX.Element {
		return (
			<div id="profile-card" className="profile card">
				<img id="picture" className="profile" src={this.props.picturePath || defaultUserPic} alt="Profile Picture" />
				<div id="username" className="profile">{this.props.name}</div>
			</div>
		);
	}
}
