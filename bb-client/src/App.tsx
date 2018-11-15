import React from "react";
import { Route } from "react-router";
import NavigationBar from "./components/NavigationBar";
import DashboardPage from "./components/pages/DashboardPage";
import MealPage from "./components/pages/MealPage";
import User from "./entities/User";
import "./resources/App.css";
import "./resources/common.css";

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
						date: new Date("December 21, 2018 18:30:00"),
						location: "College Station, TX",
						title: "Cuban delight",
						guests: [
							{
								id: 4,
								firstName: "Micky",
								lastName: "Li",
							},
							{
								firstName: "Greg",
								lastName: "Noonan",
							},
							{
								firstName: "Jon",
								lastName: "Wang",
							},
						],
						price: 40,
						maxGuests: 3,
					},
					{
						id: 2,
						host: {
							id: 5,
							firstName: "Jonathan",
							lastName: "Wang",
						},
						date: new Date("December 17, 2018 19:24:00"),
						location: "College Station, TX",
						title: "Mexican Night Out",
						guests: [],
						maxGuests: 4,
					},
				],
			},
		});
	}

	public render(): JSX.Element {
		return (
			<div>
				<div id="Top">
					<NavigationBar />
				</div>
				<div id="page-content">
					<div id="content-container">
						<Route exact path="/" render={() => <DashboardPage user={this.state.user} />} />
						<Route exact path="/m/:mealID" component={MealPage} />
						{/* <Route exact path="/m/:mealID/e/" component={MealEditPage} />
						<Route exact path="/p/:userID" component={ProfilePage} />
						<Route exact path="/p/:userID/e/" component={ProfileEditPage} />
						<Route exact path="/r/:recipeID" component={RecipePage} />
						<Route exact path="/r/:recipeID/e/" component={RecipeEditPage} /> */}
					</div>
				</div>
			</div >
		);
	}
}
