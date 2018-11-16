// tslint:disable: no-unsafe-any
import React from "react";
import { Link } from "react-router-dom";
import "./resources/css/ProfileSummary.css";
import { default as defaultUserPic } from "./resources/images/default_user_pic.png";

interface IProfileSummaryProps {
	id: number;
	name: string;
	imagePath?: string;
}

export default class ProfileSummary extends React.Component<IProfileSummaryProps> {
	public render(): JSX.Element {
		return (
			<Link to={`/p/${this.props.id}`}>
				<div id="profile-summary" className="card no-link">
					<img id="profile-summary-picture" src={this.props.imagePath === undefined ? defaultUserPic : this.props.imagePath} alt="Profile Picture" />
					<div id="profile-summary-username" className="container-header">{this.props.name}</div>
				</div>
			</Link>
		);
	}
}
