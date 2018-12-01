import { gql } from "apollo-boost";
import React from "react";
import { Query, QueryResult } from "react-apollo";
import { Route, RouteComponentProps, Router, Switch } from "react-router";
import { WebAuthentication } from "./auth/WebAuthentication";
import Loading from "./components/Loading";
import NavigationBar from "./components/NavigationBar";
import history from "./history";
import Callback from "./pages/AuthCallbackPage";
import DashboardPage from "./pages/DashboardPage";
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

const auth = new WebAuthentication();

const handleAuthentication = (props: RouteComponentProps) => {
	if (/access_token|id_token|error/.test(location.hash)) {
		auth.handleAuthentication();
	}
};

export interface IAppContext {
	userID?: number;
	reloadUser?(): void;
}

interface IUserAuthenticatedResult {
	userAuthenticated: {
		id: number;
	};
}

// tslint:disable-next-line: variable-name
export const UserContext = React.createContext<IAppContext>({ userID: undefined, reloadUser: undefined });

export default class App extends React.Component {
	public render(): JSX.Element {
		return (
			<Query query={USER_AUTHENTICATED}>
				{(result: QueryResult<IUserAuthenticatedResult>) => {
					if (result.loading) {
						return <Loading />;
					}
					if (result.error) {
						return (
							<div>
								{`Error! Something terrible has happened! ${result.error.message}`}
							</div>
						);
					}

					return (
						<Router history={history}>
							<div>
								<div id="top">
									<NavigationBar auth={auth} />
								</div>
								<div id="page-content">
									<div id="content-container">
										<UserContext.Provider value={{ userID: result.data!.userAuthenticated.id, reloadUser: () => result.refetch() }}>
											<Switch>
												<Route exact path="/" component={DashboardPage} />
												{/* <Route exact path="/m/:mealID" component={MealPage} /> */}
												<Route exact path="/p/:userID" component={ProfilePage} />
												{/* <Route exact path="/r/:recipeID" component={RecipePage} /> */}
												<Route
													path="/callback"
													render={props => {
														handleAuthentication(props);
														return <Callback {...props} />;
													}}
												/>
											</Switch>
										</UserContext.Provider>
									</div>
								</div>
							</div>
						</Router>
					);
				}}
			</Query>
		);
	}
}
