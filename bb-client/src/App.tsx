import { InMemoryCache } from "apollo-cache-inmemory";
import ApolloClient from "apollo-client";
import { ApolloLink } from "apollo-link";
import { BatchHttpLink } from "apollo-link-batch-http";
import { ErrorResponse, onError } from "apollo-link-error";
import { ServerError } from "apollo-link-http-common";
import gql from "graphql-tag";
import React from "react";
import { ApolloProvider, Query, QueryResult } from "react-apollo";
import { Route, Switch } from "react-router";
import NotFound from "../src/components/NotFound";
import { WebAuthentication } from "./auth/WebAuthentication";
import NavigationBar from "./components/NavigationBar";
import AuthCallbackPage from "./pages/AuthCallbackPage";
import DashboardPage from "./pages/DashboardPage";
import MealPage from "./pages/MealPage";
import ProfilePage from "./pages/ProfilePage";
import "./resources/css/App.css";
import "./resources/css/common.css";

const USER_AUTHENTICATED = gql`
	query UserAuthenticated {
		userAuthenticated {
			id
		}
	}
`;

export interface IAppContext {
	userID?: number;
	auth?: WebAuthentication;
	reloadUser?(): void;
}

interface IUserAuthenticatedResult {
	userAuthenticated: {
		id: number;
	} | null;
}

const uri = process.env.NODE_ENV === "development" ? "http://localhost:10262/graphql" : "https://www.bbread.org/api/v1/graphql";
console.log(`URI: ${uri}`);

// tslint:disable-next-line: variable-name
export const UserContext = React.createContext<IAppContext>({ userID: undefined, reloadUser: undefined, auth: undefined });

export default class App extends React.Component {
	public render(): JSX.Element {
		let accessToken: string | null = localStorage.getItem("access_token");
		accessToken = accessToken === null ? "" : accessToken;
		const client = new ApolloClient({
			link: ApolloLink.from([
				onError((error: ErrorResponse) => {
					console.log("I AM AN ERROR");
					if (error.graphQLErrors) {
						error.graphQLErrors.map(graphQLError => {
							console.log(
								`[GraphQL error]: Message: ${graphQLError.message}, Location: ${graphQLError.locations}, Path: ${graphQLError.path}`
							);
						});
					}

					if (error.networkError) {
						console.log(`[Network error]: ${error.networkError}`);
						const e = error.networkError as ServerError;
						if (e.statusCode === 404) {
							console.log("I am a 404 error");
							document.write("<h1>you suck</h1>");
						}
					}
				}),
				new BatchHttpLink({
					uri,
					headers: {
						token_bearer: accessToken,
					},
				}),
			]),
			cache: new InMemoryCache(),
		});

		return (
			<ApolloProvider client={client}>
				<Query query={USER_AUTHENTICATED}>
					{(result: QueryResult<IUserAuthenticatedResult>) => {
						if (result.loading) {
							return <div></div>;
						}
						if (result.error) {
							console.log(result.error);
							return <div>{result.error.message}</div>;
						}

						const auth: WebAuthentication = new WebAuthentication();

						return (
							<div>
								<div id="top">
									<NavigationBar auth={auth} />
								</div>
								<div id="page-content">
									<div id="content-container">
										<UserContext.Provider value={{ userID: result.data!.userAuthenticated === null ? undefined : result.data!.userAuthenticated!.id, reloadUser: () => result.refetch(), auth }}>
											<Switch>
												<Route exact path="/" component={DashboardPage} />
												<Route exact path="/m/:mealID" component={MealPage} />
												<Route exact path="/p/:userID" component={ProfilePage} />
												{/* <Route exact path="/r/:recipeID" component={RecipePage} /> */}
												<Route exact path="/bb-auth" component={AuthCallbackPage} />
												<Route component={NotFound} />
											</Switch>
										</UserContext.Provider>
									</div>
								</div>
							</div>
						);
					}}
				</Query>
			</ApolloProvider>
		);
	}
}
