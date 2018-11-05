// tslint:disable: no-unsafe-any
import React from "react";
import { User } from "../../App";
import NavigationBar from "../NavigationBar";
import "../resources/css/Dashboard.css";
import Feed from "./Center/Feed";
import FollowedTagsTopics from "./Left/FollowedTagsTopics";
import ProfileCard from "./Left/ProfileCard";
import UpcomingMealsCard from "./Right/UpcomingMealsCard";

interface IDashboardProps {
	user?: User;
}

export default class Dashboard extends React.Component<IDashboardProps> {
	public render(): JSX.Element {
		return (
			<div>
				<NavigationBar />
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
					{
						this.props.user === undefined ? undefined : (
							<UpcomingMealsCard upcomingMeals={this.props.user.upcomingMeals} />
						)
					}
				</div>
			</div>
		);
	}
}
