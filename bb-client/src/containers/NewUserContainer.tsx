import ApolloClient from "apollo-client";
import React from "react";
import { ApolloConsumer } from "react-apollo";
import NewUser from "../components/NewUser";

interface IRetreivedProfileInfo {
	email?: string;
	emailVerified?: boolean;
	lastName?: string;
	firstName?: string;
	picture?: string;
	reloadUser: Function;
	onValidSet?: Function;
}

export default class NewUserContainer extends React.Component<IRetreivedProfileInfo> {
	constructor(props: IRetreivedProfileInfo) {
		super(props);
	}

	public submitNewUser = (client: ApolloClient<any>) => {
		if (this.props.onValidSet !== undefined) {
			alert("hello");
			this.props.onValidSet();
			this.props.reloadUser();
		} else {
			console.log("Some error higher up with token");
		}
	}

	public renderNewUser = (client: ApolloClient<any>): JSX.Element => {
		if (this.props.firstName !== undefined) {
			return (
				<NewUser
					email={this.props.email!}
					emailVerified={this.props.emailVerified!}
					lastName={this.props.lastName!}
					firstName={this.props.firstName}
					picture={this.props.picture!}
					validSubmit={() => this.submitNewUser(client)}
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
			<ApolloConsumer>
				{client => {
					return (
						<div>
							{this.renderNewUser(client)}
						</div>
					);
				}}
			</ApolloConsumer>
		);
	}
}
