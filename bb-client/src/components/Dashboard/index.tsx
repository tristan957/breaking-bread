// tslint:disable: no-unsafe-any
import React from "react";
import MediaQuery from "react-responsive";
import User from "../../entities/User";
import "../resources/css/Dashboard.css";
import Feed from "./Center/Feed";
import FollowedTagsTopics from "./Left/FollowedTagsTopics";
import ProfileCard from "./Left/ProfileCard";
import UpcomingMealsCard from "./Right/UpcomingMealsCard";

interface IDashboardProps {
	user?: Partial<User>;
}

export default class Dashboard extends React.Component<IDashboardProps> {
	public render(): JSX.Element {
		return (
			<div>
				{/*
				<MediaQuery query="(max-width: 950px)">
					<div id="Top">
						<NavigationBar />
					</div>
					<div id="mobileSidebar">
						<MobileSidebar />
					</div>
				</MediaQuery>
				*/}

				<MediaQuery query="(min-width: 500px)">
					<div id="Left">
						{
							this.props.user === undefined ? undefined : (
								<div>
									<ProfileCard name={`${this.props.user.firstName} ${this.props.user.lastName}`} imagePath={this.props.user.imagePath} />
									<FollowedTagsTopics tags={this.props.user.followedTags || []} topics={this.props.user.whitelist || []} />
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
								<UpcomingMealsCard mealsAttending={this.props.user.mealsAttending || []} />
							)
						}
					</div>
				</MediaQuery>
			</div>
		);
	}
}
