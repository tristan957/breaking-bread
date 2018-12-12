import ApolloClient, { ApolloQueryResult } from "apollo-client";
import { Auth0DecodedHash, Auth0Error } from "auth0-js";
import gql from "graphql-tag";
import JwtDecode from "jwt-decode";
import React from "react";
import { ApolloConsumer } from "react-apollo";
import { RouteComponentProps } from "react-router";
import { UserContext } from "../App";
import { IAccessToken, IProfileInfo, WebAuthentication } from "../auth/WebAuthentication";
import NotFound from "../components/NotFound";
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
	userSub?: string;
	onValidSet?: Function;
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

	public handleAuthentication = (auth: WebAuthentication, reloadUser: Function, client: ApolloClient<any>): void => {
		if (/access_token|id_token|error/.test(location.hash)) {
			auth.handleAuthentication().then((decodedHash: Auth0DecodedHash) => {
				if (decodedHash.accessToken === undefined) { return; }

				const decoded: IAccessToken = JwtDecode(decodedHash.accessToken);
				client.query({
					query: USER_SUB_EXISTS,
					variables: { "sub": decoded.sub },
				}).then((result: ApolloQueryResult<IUserSubExistsResult>) => {
					if (result.data.userSubExists!) {
						auth.setSession(decodedHash);
						reloadUser();
						this.props.history.push("/");
					} else {
						auth.getUserInfo(decodedHash).then(
							(userInfo: IProfileInfo) => this.setState({ ...userInfo, userSub: decoded.sub, onValidSet: () => auth.setSession(decodedHash) })
						);
					}
				}).catch((err: Error) => {
					// console.log(err); // TODO: Invalid login
				});
			}).catch((err: Auth0Error) => {
				// console.log(err); // TODO: Invalid login // FIXME: Need to investigate excess trigger here
			});
		}
	}

	public render(): JSX.Element {
		return (
			<UserContext.Consumer>
				{userContext => {
					return (
						<ApolloConsumer>
							{client => {
								if (userContext.auth === undefined) {
									return (
										<NotFound></NotFound>
									);
								}

								this.handleAuthentication(userContext.auth, userContext.reloadUser!, client);
								return (
									<div>
										<NewUserContainer
											email={this.state.email}
											emailVerified={this.state.emailVerified}
											lastName={this.state.lastName}
											firstName={this.state.firstName}
											picture={this.state.imagePath}
											userSub={this.state.userSub}
											onValidSet={this.state.onValidSet}
											reloadUser={() => {
												if (userContext.reloadUser === undefined) { return console.log("reloadUser is undefined"); }
												userContext.reloadUser();
												this.props.history.push("/");
											}}
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
