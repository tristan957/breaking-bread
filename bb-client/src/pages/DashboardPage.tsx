// tslint:disable: no-unsafe-any
import React from "react";
import MediaQuery from "react-responsive";
import { RouteComponentProps } from "react-router";
import { UserContext } from "../App";
import MobileSidebar from "../components/MobileSidebar";
import FeedContainer from "../containers/FeedContainer";
import ProfileSummaryContainer from "../containers/ProfileSummaryContainer";
import TagsContainer from "../containers/TagsContainer";
import TopicsContainer from "../containers/TopicsContainer";
import UpcomingMealsContainer from "../containers/UpcomingMealsContainer";
import "./resources/css/DashboardPage.css";

export default class DashboardPage extends React.Component<RouteComponentProps> {
	public render(): JSX.Element {
		return (
			<UserContext.Consumer>
				{userContext => {
					return (
						<div>
							<MediaQuery query="(max-width: 949px)">
								<div id="mobileSidebar">
									<MobileSidebar user={userContext.user} />
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
											userContext.user === undefined ? undefined : (
												<div>
													<ProfileSummaryContainer user={userContext.user} />
													<TagsContainer tags={userContext.user.followedTags || []} />
													<TopicsContainer topics={userContext.user.whitelist || []} />
												</div>
											)
										}
									</div>
									<div id="center-container">
										<FeedContainer />
									</div>
									<div id="right-container">
										{
											userContext.user === undefined ? undefined : (
												<UpcomingMealsContainer mealsAttending={userContext.user.mealsAttending || []} />
											)
										}
									</div>
								</div>
							</MediaQuery>
						</div>
					);
				}}
			</UserContext.Consumer>
		);
	}
}
