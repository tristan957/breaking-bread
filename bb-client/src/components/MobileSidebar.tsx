import React from "react";
import { slide as Menu } from "react-burger-menu";
import ProfileSummaryContainer from "../containers/ProfileSummaryContainer";
import TagsContainer from "../containers/TagsContainer";
import TopicsContainer from "../containers/TopicsContainer";
import UpcomingMealsContainer from "../containers/UpcomingMealsContainer";
import "./resources/css/MobileSidebar.css";
import { default as MealIcon } from "./resources/images/meal-icon.svg";
import { default as UserIcon } from "./resources/images/user-icon.svg";
import { TopicType } from "./Topics";

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
					{this.props.userID === undefined ? undefined : (
						<Menu burgerButtonClassName={"leftPane"} customBurgerIcon={<img src={UserIcon} />}>
							<div>
								<div>
									<ProfileSummaryContainer userID={this.props.userID} />
									<TagsContainer userID={this.props.userID} mutable />
									<TopicsContainer userID={this.props.userID} type={TopicType.WHITELIST} mutable />
								</div>
							</div>
						</Menu>
					)}
				</div>
				<div id="center"></div>
				<div id="right">
					{this.props.userID === undefined ? undefined : (
						<Menu burgerButtonClassName={"rightPane"} customBurgerIcon={<img src={MealIcon} />} right>
							<div>
								<UpcomingMealsContainer userID={this.props.userID} />
							</div>
						</Menu>
					)}
				</div>
			</div>
		);
	}
}
