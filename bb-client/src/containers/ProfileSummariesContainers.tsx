import React from "react";
import User from "../entities/User";
import ProfileSummaryContainer from "./ProfileSummaryContainer";
import "./resources/css/ProfileSummariesContainers.css";

interface IProfileSummaryContainersProps {
	users: Partial<User>[];
}

export default class ProfileSummariesContainers extends React.Component<IProfileSummaryContainersProps> {
	public render(): JSX.Element {
		return (
			<div id="profile-summaries-containers">
				{this.props.users.map((user, i) => {
					return <ProfileSummaryContainer key={i} userID={user.id!} />;
				})}
			</div>
		);
	}
}
