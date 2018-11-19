import React from "react";
import { Route, Switch } from "react-router";
import NavigationBar from "./components/NavigationBar";
import User from "./entities/User";
import DashboardPage from "./pages/DashboardPage";
import MealPage from "./pages/MealPage";
import ProfilePage from "./pages/ProfilePage";
import RecipePage from "./pages/RecipePage";
import "./resources/css/App.css";
import "./resources/css/common.css";

export interface IAppContext {
	user?: Partial<User>;
}

// tslint:disable-next-line: variable-name
export const UserContext = React.createContext<IAppContext>({ user: undefined });

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
				about: "Rough tough white boy stuff.",
				createdAt: new Date("November 15, 2018 18:30:00"),
				whitelist: [
					{ id: 1, name: "Food" },
					{ id: 2, name: "Nuts" },
				],
				blacklist: [
					{ id: 3, name: "Fun" },
					{ id: 4, name: "Music" },
				],
				followedTags: [
					{ id: 1, name: "Vegan" },
					{ id: 2, name: "Veget" },
				],
				mealsAttending: [ // TODO: Sort and sansity on the backend (remove past meals, sort by next coming)
					{
						id: 1,
						date: new Date("December 21, 2018 18:30:00"),
						location: "College Station, TX",
						title: "Cuban Delight",
						guests: [
							{
								id: 4,
								firstName: "Micky",
								lastName: "Li",
							},
							{
								id: 5,
								firstName: "Greg",
								lastName: "Noonan",
							},
							{
								id: 6,
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
				recipesAuthored: [
					{
						id: 1,
						name: "Arroz con pollo",
						description: "Traditional chicken and rice",
					},
					{
						id: 2,
						name: "Ropa vieja",
						description: "A classic and a national dish of Cuba",
						timesFavorited: 10,
					},
				],
				reviews: [
					{
						id: 1,
						rating: 5,
					},
					{
						id: 2,
						rating: 4,
					},
					{
						id: 3,
						rating: 2,
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
						<UserContext.Provider value={{ user: this.state.user }}>
							<Switch>
								<Route exact path="/" component={DashboardPage} />
								<Route exact path="/m/:mealID" component={MealPage} />
								<Route exact path="/p/:userID" component={ProfilePage} />
								<Route exact path="/r/:recipeID" component={RecipePage} />
							</Switch>
						</UserContext.Provider>
					</div>
				</div>
			</div >
		);
	}
}
