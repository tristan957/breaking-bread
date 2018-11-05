import React from "react";
import "./App.css";
import Dashboard from "./components/Dashboard";
import Meal from "./entities/Meal";
import Tag from "./entities/Tag";
import Topic from "./entities/Topic";

export type User = {
	id: number;
	name: string;
	tags: Tag[];
	topics: Topic[];
	upcomingMeals: Partial<Meal>[];
};

export default class App extends React.Component {
	private user?: User;

	public componentWillMount(): void {
		// check local storage for user already logged in, if not undefined
		this.user = {
			id: 5,
			name: "Tristan Partin",
			topics: [
				{ id: 1, name: "Food" },
				{ id: 2, name: "Nuts" },
			],
			tags: [
				{ id: 1, name: "Vegan" },
				{ id: 2, name: "Veget" },
			],
			upcomingMeals: [
				{
					id: 1,
					location: "Your Mom's house",
					imagePath: undefined,
					title: "Mom's home cooking",
					date: new Date(),
				},
			],
		};
	}

	public render(): JSX.Element {
		return (
			<Dashboard user={this.user} />
		);
	}
}
