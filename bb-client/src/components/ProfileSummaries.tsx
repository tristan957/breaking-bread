import React from "react";
import User from "../entities/User";
import ProfileSummary from "./ProfileSummary";
import "./resources/css/ProfileSummaries.css";

interface IProfileSummariesProps {
	users: Partial<User>[];
}

export default class ProfileSummaries extends React.Component<IProfileSummariesProps> {
	public render(): JSX.Element {
		return (
			<div>
				<ul id="profile-summaries" className="no-style-list">
					{this.props.users.map((user, i) => {
						return (
							<li key={i}>
								<ProfileSummary id={user.id!} name={user.name!} imagePath={user.imagePath} />
							</li>
						);
					})}
				</ul>
			</div>
		);
	}
}
