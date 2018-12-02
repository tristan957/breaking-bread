import gql from "graphql-tag";
import React from "react";
import { Query, QueryResult } from "react-apollo";
import { Route, Switch } from "react-router";
import NavigationBar from "./components/NavigationBar";
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
						return <div></div>;
					}
					if (result.error) {
						console.log(result.error);
						return <div>{result.error.message}</div>;
					}

					return (
						<div>
							<div id="top">
								<NavigationBar />
							</div>
							<div id="page-content">
								<div id="content-container">
									<UserContext.Provider value={{ userID: result.data!.userAuthenticated.id, reloadUser: () => result.refetch() }}>
										<Switch>
											<Route exact path="/" component={DashboardPage} />
											<Route exact path="/m/:mealID" component={MealPage} />
											<Route exact path="/p/:userID" component={ProfilePage} />
											{/* <Route exact path="/r/:recipeID" component={RecipePage} /> */}
										</Switch>
									</UserContext.Provider>
								</div>
							</div>
						</div>
					);
				}}
			</Query>
		);
	}
}
