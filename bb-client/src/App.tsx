import React from "react";
import "./App.css";
import Dashboard from "./components/Dashboard";

export type User = {
	id: number;
	name: string;
	tags: string[];
	topics: string[];
	upcomingMeals: Meal[];
};

export type Meal = {
	id: number;
	location: string;
	imagePath?: string;
	title: string;
	date: Date;
};

export default class App extends React.Component {
	private user?: User;
	private meal: Meal;

	constructor(props: undefined) {
		super({});

		// check local storage for user already logged in, if not undefined
		this.user = {
			id: 5,
			name: "Tristan Partin",
			topics: [
				"Your Mom",
				"Your Dad",
			],
			tags: [
				"Vegan",
				"Vegetarian",
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

		this.meal = {
			id: 1,
			location: "EDC",
			imagePath: "blah",
			title: "String Beef",
			date: new Date(),
		};
	}

	public render(): JSX.Element {
		return (
			<Dashboard user={this.user} upcomingMeals={[this.meal]} />
		);
	}
}
