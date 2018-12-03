import React from "react";
import { RouteComponentProps } from "react-router";
import NewUser from "../components/NewUser";

interface IRetreivedProfileInfo {
	email?: string;
	emailVerified?: boolean;
	lastName?: string;
	firstName?: string;
	picture?: string;
	router: RouteComponentProps;
}

export default class NewUserContainer extends React.Component<IRetreivedProfileInfo> {
	constructor(props: IRetreivedProfileInfo) {
		super(props);
	}

	public renderNewUser = (): JSX.Element => {
		if (this.props.firstName !== undefined) {
			return (
				<NewUser
					email={this.props.email!}
					emailVerified={this.props.emailVerified!}
					lastName={this.props.lastName!}
					firstName={this.props.firstName}
					picture={this.props.picture!}
					router={this.props.router}
				/>
			);
		} else {
			return (
				<div></div>
			);
		}
	}

	public render(): JSX.Element {
		return (
			<div>
				{this.renderNewUser()}
			</div>
		);
	}
}
