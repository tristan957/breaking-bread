// tslint:disable: no-unsafe-any
import React from "react";
import MediaQuery from "react-responsive";
import User from "../../entities/User";
import MobileSidebar from "../MobileSidebar";
import "../resources/css/Dashboard.css";
import Feed from "./Center/Feed";
import FollowedTagsCard from "./Left/FollowedTagsCard";
import ProfileCard from "./Left/ProfileCard";
import UpcomingMealsCard from "./Right/UpcomingMealsCard";

interface IDashboardProps {
	user?: Partial<User>;
}

export default class Dashboard extends React.Component<IDashboardProps> {
	public render(): JSX.Element {
		return (
			<div>
				<MediaQuery query="(max-width: 949px)">
					<div id="mobileSidebar">
						<MobileSidebar {...this.props} />
					</div>
					<div id="TopPlaceHolder"></div>
					<div id="mobileCenter">
						<Feed />
					</div>
				</MediaQuery>

				<MediaQuery query="(min-width: 950px)">
					<div id="Left">
						{
							this.props.user === undefined ? undefined : (
								<div>
									<ProfileCard name={`${this.props.user.firstName} ${this.props.user.lastName}`} imagePath={this.props.user.imagePath} />
									<FollowedTagsCard tags={this.props.user.followedTags || []} topics={this.props.user.whitelist || []} />
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
