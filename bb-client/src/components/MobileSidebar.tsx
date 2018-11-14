// tslint:disable: no-unsafe-any
import React from "react";
import { slide as Menu } from "react-burger-menu";
import User from "../entities/User";
import ProfileSummaryCard from "./cards/ProfileSummaryCard";
import FollowedTagsContainer from "./containers/FollowedTagsContainer";
import FollowedTopicsContainer from "./containers/FollowedTopicsContainer";
import UpcomingMealsContainer from "./containers/UpcomingMealsContainer";
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
			<div id="container">
				<div id="left">
					<Menu burgerButtonClassName={"leftPane"}>
						<div>
							{this.props.user === undefined ? undefined : (
								<div>
									<ProfileSummaryCard name={`${this.props.user.firstName} ${this.props.user.lastName}`} imagePath={this.props.user.imagePath} />
									<FollowedTagsContainer tags={this.props.user.followedTags || []} />
									<FollowedTopicsContainer topics={this.props.user.whitelist || []} />
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
