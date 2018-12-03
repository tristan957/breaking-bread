import ApolloClient, { ApolloQueryResult } from "apollo-client";
import { Auth0Error } from "auth0-js";
import gql from "graphql-tag";
import React from "react";
import { ApolloConsumer } from "react-apollo";
import { RouteComponentProps } from "react-router";
import { UserContext } from "../App";
import { IProfileInfo, WebAuthentication } from "../auth/WebAuthentication";
import NewUserContainer from "../containers/NewUserContainer";

const USER_SUB_EXISTS = gql`
	query UserSubExists($sub: String!) {
		userSubExists(sub: $sub)
	}
`;

interface IUserSubExistsResult {
	userSubExists?: boolean;
}

interface IAuthCallbackPageProps { }

interface IAuthCallbackPageState {
	email?: string;
	emailVerified?: boolean;
	lastName?: string;
	firstName?: string;
	imagePath?: string;
}

export default class AuthCallbackPage extends React.Component<RouteComponentProps<IAuthCallbackPageProps>, IAuthCallbackPageState> {
	constructor(props: RouteComponentProps<IAuthCallbackPageProps>) {
		super(props);

		this.state = {
			email: undefined,
			emailVerified: undefined,
			lastName: undefined,
			firstName: undefined,
			imagePath: undefined,
		};
	}

	public handleAuthentication = (auth: WebAuthentication, client: ApolloClient<any>): void => {
		if (/access_token|id_token|error/.test(location.hash)) {
			auth.handleAuthentication().then((userInfo: IProfileInfo) => {
				console.log(userInfo);
				client.query({
					query: USER_SUB_EXISTS,
					variables: { "sub": "facebook|2245887208763909" },
				}).then((result: ApolloQueryResult<IUserSubExistsResult>) => {
					console.log(result.data);
					this.setState({ ...userInfo });
				}).catch((err: Error) => {
					console.log(err); // TODO: Invalid login
				});
			}).catch((err: Auth0Error) => {
				console.log(err); // TODO: Invalid login
			});
		}
	}

	public render(): JSX.Element {
		console.log(this.props);
		return (
			<UserContext.Consumer>
				{userContext => {
					return (
						<ApolloConsumer>
							{client => {
								if (userContext.auth === undefined) {
									return (
										<div>
										</div>
									);
								}

								this.handleAuthentication(userContext.auth, client);
								return (
									<div>
										<NewUserContainer
											email={this.state.email}
											emailVerified={this.state.emailVerified}
											lastName={this.state.lastName}
											firstName={this.state.firstName}
											picture={this.state.imagePath}
										/>
									</div>
								);
							}}
						</ApolloConsumer>
					);
				}}
			</UserContext.Consumer>
		);
	}
}
