// tslint:disable: no-unsafe-any
import React from "react";
import { default as defaultUserPic } from "../../resources/images/default_user_pic.png";

interface IGuestCardProps {
	id: number;
	name: string;
	imagePath?: string;
}

export default class GuestCard extends React.Component<IGuestCardProps> {
	public render(): JSX.Element {
		return (
			// TODO: Link to user page
			// TODO: Show kickable button if host of meal
			<div id="profile-card" className="profile card">
				<div id="username" className="profile">
					<img id="picture" className="profile" src={this.props.imagePath === undefined ? defaultUserPic : this.props.imagePath} alt="Profile Picture" />
					{this.props.name}
				</div>
			</div>
		);
	}
}
