// tslint:disable: no-unsafe-any
import React from "react";
import { Link } from "react-router-dom";
import "../resources/css/ProfileCard.css";
import { default as defaultUserPic } from "../resources/images/default_user_pic.png";

interface IProfileSummaryCardProps {
	id: number;
	name: string;
	imagePath?: string;
}

export default class ProfileSummaryCard extends React.Component<IProfileSummaryCardProps> {
	public render(): JSX.Element {
		return (
			<Link to={`/p/${this.props.id}`}>
				<div id="profile-card" className="profile card no-link">
					<div id="username" className="profile">
						<img id="picture" className="profile" src={this.props.imagePath === undefined ? defaultUserPic : this.props.imagePath} alt="Profile Picture" />
						{this.props.name}
					</div>
				</div>
			</Link>
		);
	}
}
