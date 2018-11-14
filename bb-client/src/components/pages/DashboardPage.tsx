// tslint:disable: no-unsafe-any
import React from "react";
import MediaQuery from "react-responsive";
import User from "../../entities/User";
import ProfileSummaryCard from "../cards/ProfileSummaryCard";
import FeedContainer from "../containers/FeedContainer";
import FollowedTagsContainer from "../containers/FollowedTagsContainer";
import FollowedTopicsContainer from "../containers/FollowedTopicsContainer";
import UpcomingMealsContainer from "../containers/UpcomingMealsContainer";
import MobileSidebar from "../MobileSidebar";
import "../resources/css/Dashboard.css";

interface IDashboardPageProps {
	user?: Partial<User>;
}

export default class DashboardPage extends React.Component<IDashboardPageProps> {
	public render(): JSX.Element {
		return (
			<div>
				<MediaQuery query="(max-width: 949px)">
					<div id="mobileSidebar">
						<MobileSidebar {...this.props} />
					</div>
					<div id="TopPlaceHolder"></div>
					<div id="mobileCenter">
						<FeedContainer />
					</div>
				</MediaQuery>

				<MediaQuery query="(min-width: 950px)">
					<div id="dashboard">
						<div className="whitespace"></div>
						<div id="Left">
							{
								this.props.user === undefined ? undefined : (
									<div>
										<ProfileSummaryCard name={`${this.props.user.firstName} ${this.props.user.lastName}`} imagePath={this.props.user.imagePath} />
										<FollowedTagsContainer tags={this.props.user.followedTags || []} />
										<FollowedTopicsContainer topics={this.props.user.whitelist || []} />
									</div>
								)
							}
						</div>
						<div id="Center">
							<FeedContainer />
						</div>
						<div id="Right">
							{
								this.props.user === undefined ? undefined : (
									<UpcomingMealsContainer mealsAttending={this.props.user.mealsAttending || []} />
								)
							}
						</div>
						<div className="whitespace"></div>
					</div>
				</MediaQuery>
			</div>
		);
	}
}
