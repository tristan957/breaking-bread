import React from "react";
import { User } from "../../App";
import "../resources/css/Dashboard.css";
import Feed from "./Center/Feed";
import FollowedTagsTopics from "./Left/FollowedTagsTopics";
import ProfileCard from "./Left/ProfileCard";

interface IDashboardProps {
	user?: User;
}

export default class Dashboard extends React.Component<IDashboardProps> {
	public render(): JSX.Element {
		return (
			<div>
				<div id="Left">
					{
						this.props.user === undefined ? undefined : (
							<div>
								<ProfileCard userID={this.props.user.id} name={this.props.user.name} />
								<FollowedTagsTopics tags={this.props.user.tags} topics={this.props.user.topics} />
							</div>
						)
					}
				</div>
				<div id="Center">
					<Feed />
				</div>
				<div id="Right">
					<Feed />
				</div>
			</div>
		);
	}
}
