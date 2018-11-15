// tslint:disable: no-unsafe-any
import React from "react";
import "../resources/css/ProfileCard.css";
import { default as defaultUserPic } from "../resources/images/default_user_pic.png";

interface IProfileSummaryProps {
	name: string;
	imagePath?: string;
}

export default class ProfileSummary extends React.Component<IProfileSummaryProps> {
	public render(): JSX.Element {
		return (
			<div id="profile-card" className="profile card">
				<img id="picture" className="profile" src={this.props.imagePath === undefined ? defaultUserPic : this.props.imagePath} alt="Profile Picture" />
				<div id="username" className="profile">{this.props.name}</div>
			</div>
		);
	}
}
