import { Auth0Error } from "auth0-js";
import * as React from "react";
import { RouteComponentProps } from "react-router";
import { UserContext } from "../App";
import { IProfileInfo, WebAuthentication } from "../auth/WebAuthentication";

export interface IAuthCallbackPageProps { }

export default class AuthCallbackPage extends React.Component<RouteComponentProps<IAuthCallbackPageProps>> {
	public style: React.CSSProperties = {
		position: "absolute",
		display: "flex",
		justifyContent: "center",
		height: "100vh",
		width: "100vw",
		top: 0,
		bottom: 0,
		left: 0,
		right: 0,
		backgroundColor: "white",
	};

	public handleAuthentication = (auth: WebAuthentication): void => {
		if (/access_token|id_token|error/.test(location.hash)) {
			auth.handleAuthentication().then((userInfo: IProfileInfo) => {
				console.log(userInfo);
			}).catch((err: Auth0Error) => {
				console.log(err);
			});
		}
	}

	public render(): JSX.Element {
		console.log(this.props);
		return (
			<UserContext.Consumer>
				{userContext => {
					if (userContext.auth === undefined) {
						return (
							<div style={this.style}>
							</div>
						);
					}

					this.handleAuthentication(userContext.auth);
					return (
						<div style={this.style}>
							kfajdlkfj
						</div>
					);
				}}
			</UserContext.Consumer>
		);
	}
}
