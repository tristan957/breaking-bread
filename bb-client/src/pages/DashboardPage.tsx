// tslint:disable: no-unsafe-any
import React from "react";
import MediaQuery from "react-responsive";
import MobileSidebar from "../components/MobileSidebar";
import FeedContainer from "../containers/FeedContainer";
import ProfileSummaryContainer from "../containers/ProfileSummaryContainer";
import TagsContainer from "../containers/TagsContainer";
import TopicsContainer from "../containers/TopicsContainer";
import UpcomingMealsContainer from "../containers/UpcomingMealsContainer";
import User from "../entities/User";
import "./resources/css/DashboardPage.css";

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
					<div id="top-buffer"></div>
					<div id="mobile-center">
						<FeedContainer />
					</div>
				</MediaQuery>

				<MediaQuery query="(min-width: 950px)">
					<div id="dashboard">
						<div id="left-container">
							{
								this.props.user === undefined ? undefined : (
									<div>
										<ProfileSummaryContainer user={this.props.user} />
										<TagsContainer tags={this.props.user.followedTags || []} />
										<TopicsContainer topics={this.props.user.whitelist || []} />
									</div>
								)
							}
						</div>
						<div id="center-container">
							<FeedContainer />
						</div>
						<div id="right-container">
							{
								this.props.user === undefined ? undefined : (
									<UpcomingMealsContainer mealsAttending={this.props.user.mealsAttending || []} />
								)
							}
						</div>
					</div>
				</MediaQuery>
			</div>
		);
	}
}
