// tslint:disable: no-unsafe-any
import React from "react";
import { slide as Menu } from "react-burger-menu";
import ProfileSummaryContainer from "../containers/ProfileSummaryContainer";
import TagsContainer from "../containers/TagsContainer";
import TopicsContainer from "../containers/TopicsContainer";
import UpcomingMealsContainer from "../containers/UpcomingMealsContainer";
import User from "../entities/User";
import "./resources/css/MobileSidebar.css";

interface IAppState {
	sidebarOpen: boolean;
}

interface IDashboardProps {
	user?: Partial<User>;
}

export default class MobileSidebar extends React.Component<IDashboardProps, IAppState> {
	constructor(props: Readonly<IDashboardProps>) {
		super(props);
		this.setSidebarOpen = this.setSidebarOpen.bind(this);
		this.state = {
			sidebarOpen: true,
		};
	}

	public setSidebarOpen(): void {
		this.setState({
			sidebarOpen: !this.state.sidebarOpen,
		});
	}

	public render(): JSX.Element {
		return (
			<div id="mobile-container">
				<div id="left">
					<Menu burgerButtonClassName={"leftPane"}>
						<div>
							{this.props.user === undefined ? undefined : (
								<div>
									<ProfileSummaryContainer user={this.props.user} />
									<TagsContainer tags={this.props.user.followedTags || []} />
									<TopicsContainer topics={this.props.user.whitelist || []} />
								</div>
							)}
						</div>
					</Menu>
				</div>
				<div id="center"></div>
				<div id="right">
					<Menu burgerButtonClassName={"rightPane"} right>
						<div>
							{this.props.user === undefined ? undefined : (
								<UpcomingMealsContainer mealsAttending={this.props.user.mealsAttending || []} />
							)}
						</div>
					</Menu>
				</div>
			</div>
		);
	}
}
