import React from "react";
import { slide as Menu } from "react-burger-menu";
import UpcomingMealsContainer from "../containers/UpcomingMealsContainer";
import "./resources/css/MobileSidebar.css";

interface IMobileSidebarState {
	sidebarOpen: boolean;
}

interface IMobileDashboardProps {
	userID?: number;
}

export default class MobileSidebar extends React.Component<IMobileDashboardProps, IMobileSidebarState> {
	constructor(props: Readonly<IMobileDashboardProps>) {
		super(props);

		this.state = {
			sidebarOpen: true,
		};
	}

	public setSidebarOpen = (): void => {
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
							{/* {this.props.userID === undefined ? undefined : (
								<div>
									<ProfileSummaryContainer user={this.props.user} />
									<TagsContainer tags={this.props.user.followedTags || []} />
									<TopicsContainer topics={this.props.user.whitelist || []} />
								</div>
							)} */}
						</div>
					</Menu>
				</div>
				<div id="center"></div>
				<div id="right">
					<Menu burgerButtonClassName={"rightPane"} right>
						<div>
							{this.props.userID === undefined ? undefined : (
								<UpcomingMealsContainer userID={this.props.userID} />
							)}
						</div>
					</Menu>
				</div>
			</div>
		);
	}
}
