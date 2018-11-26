import { gql } from "apollo-boost";
import React from "react";
import { Query, QueryResult } from "react-apollo";
import { Route, Switch } from "react-router";
import Loading from "./components/Loading";
import NavigationBar from "./components/NavigationBar";
import User from "./entities/User";
import DashboardPage from "./pages/DashboardPage";
import MealPage from "./pages/MealPage";
import ProfilePage from "./pages/ProfilePage";
import RecipePage from "./pages/RecipePage";
import "./resources/css/App.css";
import "./resources/css/common.css";

const GET_LOGGED_IN_USER = gql`
	{
		getLoggedInUser {
			id
			firstName
			lastName
			imagePath
			whitelist {
				id
				name
			}
			blacklist {
				id
				name
			}
			followedTags {
				id
				name
			}
			mealsAttending {
				id
			}
			upcomingMeals {
				id
				title
				price
				startTime
				endTime
				guests {
					id
				}
				maxGuests
				location
			}
			reviews {
				id
				rating
			}
			recipesAuthored {
				id
				name
				imagePath
				description
				timesSaved
			}
		}
	}
`;

export interface IAppContext {
	user?: Partial<User>;
}

interface IGetLoggedInUserResult {
	getLoggedInUser: Partial<User>;
}

// tslint:disable-next-line: variable-name
export const UserContext = React.createContext<IAppContext>({ user: undefined });

export default class App extends React.Component {
	public render(): JSX.Element {
		return (
			<Query query={GET_LOGGED_IN_USER}>
				{(result: QueryResult<IGetLoggedInUserResult>) => {
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
						<div>
							<div id="Top">
								<NavigationBar />
							</div>
							<div id="page-content">
								<div id="content-container">
									<UserContext.Provider value={{ user: result.data!.getLoggedInUser }}>
										<Switch>
											<Route exact path="/" component={DashboardPage} />
											<Route exact path="/m/:mealID" component={MealPage} />
											<Route exact path="/p/:userID" component={ProfilePage} />
											<Route exact path="/r/:recipeID" component={RecipePage} />
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
