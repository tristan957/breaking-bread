// tslint:disable: no-unsafe-any
import React from "react";
import { slide as Menu } from "react-burger-menu";
import User from "../../entities/User";
import FollowedTagsCard from "../Dashboard/Left/FollowedTagsCard";
import ProfileCard from "../Dashboard/Left/ProfileCard";
import UpcomingMealsCard from "../Dashboard/Right/UpcomingMealsCard";
import "../resources/css/MobileSidebar.css";

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
			<div id="mobile-button-container">
				<div id="left">
					<Menu burgerButtonClassName={"left-pane"}>
						{this.props.user === undefined ? undefined : (
							<div>
								<ProfileCard name={`${this.props.user.firstName} ${this.props.user.lastName}`} imagePath={this.props.user.imagePath} />
								<FollowedTagsCard tags={this.props.user.followedTags || []} topics={this.props.user.whitelist || []} />
							</div>
						)}
					</Menu>
				</div>
				{/* <div id="center">
					<h3>Feed</h3>
				</div> */}
				<div id="right">
					<Menu burgerButtonClassName={"right-pane"} right>
						{this.props.user === undefined ? undefined : (
							<UpcomingMealsCard mealsAttending={this.props.user.mealsAttending || []} />
						)}
					</Menu>
				</div>
			</div>
		);
	}
}
