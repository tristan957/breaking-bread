import React from "react";
import { Route } from "react-router";
import "./App.css";
import Dashboard from "./components/Dashboard";
import MealPage from "./components/MealPage";
import NavigationBar from "./components/NavigationBar";
import User from "./entities/User";

interface IAppState {
	user?: Partial<User>;
}

export default class App extends React.Component<{}, IAppState> {
	constructor(props: Readonly<{}>) {
		super(props);

		this.state = {
			user: undefined,
		};
	}

	public componentWillMount(): void {
		// check local storage for user already logged in, if not undefined
		this.setState({
			user: {
				id: 5,
				firstName: "Tristan",
				lastName: "Partin",
				whitelist: [
					{ id: 1, name: "Food" },
					{ id: 2, name: "Nuts" },
				],
				followedTags: [
					{ id: 1, name: "Vegan" },
					{ id: 2, name: "Veget" },
				],
				mealsAttending: [
					{
						id: 1,
						location: "Your Mom's house",
						imagePath: undefined,
						title: "Mom's home cooking",
						date: new Date(),
					},
				],
			},
		});
	}

	public render(): JSX.Element {
		return (
			<div>
				<div id="Top" className="scrollarea">
					<NavigationBar />
				</div>
				<div id="TopPlaceHolder"></div>
				<Route exact path="/" render={() => <Dashboard user={this.state.user} />} />
				<Route exact path="/m/:mealID" component={MealPage} />
				{/* <Route exact path="/m/:mealID/e/" component={MealEditPage} />
				<Route exact path="/p/:userID" component={ProfilePage} />
				<Route exact path="/p/:userID/e/" component={ProfileEditPage} />
				<Route exact path="/r/:recipeID" component={RecipePage} />
				<Route exact path="/r/:recipeID/e/" component={RecipeEditPage} /> */}
			</div >
		);
	}
}
