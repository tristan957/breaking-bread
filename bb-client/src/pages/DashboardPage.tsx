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
import User from "../entities/User";
import "./resources/css/DashboardPage.css";

interface IDashboardPageState {
	userLoggedIn?: Partial<User>;
}

export default class DashboardPage extends React.Component<RouteComponentProps, IDashboardPageState> {
	public render(): JSX.Element {
		return (
			<UserContext.Consumer>
				{userContext => {
					this.state = {
						userLoggedIn: userContext.user,
					};

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
											this.state.userLoggedIn === undefined ? undefined : (
												<div>
													<ProfileSummaryContainer user={this.state.userLoggedIn} />
													<TagsContainer tags={this.state.userLoggedIn.followedTags || []} />
													<TopicsContainer topics={this.state.userLoggedIn.whitelist || []} />
												</div>
											)
										}
									</div>
									<div id="center-container">
										<FeedContainer />
									</div>
									<div id="right-container">
										{
											this.state.userLoggedIn === undefined ? undefined : (
												<UpcomingMealsContainer mealsAttending={this.state.userLoggedIn.mealsAttending || []} />
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
