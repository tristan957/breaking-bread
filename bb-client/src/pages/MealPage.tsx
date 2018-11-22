// tslint:disable: no-unsafe-any
import React from "react";
import MediaQuery from "react-responsive";
import { RouteComponentProps } from "react-router-dom";
import { UserContext } from "../App";
import MealDescription from "../components/MealDescription";
import GuestsContainer from "../containers/GuestsContainer";
import HostSummaryContainer from "../containers/HostSummaryContainer";
import Meal from "../entities/Meal";
import User from "../entities/User";
import "./resources/css/MealPage.css";

// tslint:disable-next-line: no-any
const loadedMeals: any = {
	1: {
		id: 1,
		host: {
			id: 3,
			firstName: "Fank",
			lastName: "Food",
			about: "I like to cook Cuban",
			whitelist: [
				{
					id: 10,
					name: "Pandas",
				},
			],
		},
		date: new Date("December 21, 2018 18:30:00"),
		description: "I'll be cooking cuban food over a wood grill in my backyard. These are family recipes that never fail to satisfy.",
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
		recipes: [
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
		price: 40,
		maxGuests: 3,
	},
	2: {
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
};

interface IMealPageParams {
	mealID: string;
}

interface IMealPageState {
	meal: Partial<Meal>;
	isGuest: boolean;
}

export default class MealPage extends React.Component<RouteComponentProps<IMealPageParams>, IMealPageState> {
	constructor(props: RouteComponentProps<IMealPageParams>) {
		super(props);

		this.fetchMealFromParams = this.fetchMealFromParams.bind(this);
		this.setMeal = this.setMeal.bind(this);

		this.state = {
			meal: this.fetchMealFromParams(),
			isGuest: false,
		};
	}

	private fetchMealFromParams(): Partial<Meal> {
		const mealID: number = parseInt(this.props.match.params.mealID, 10);
		return loadedMeals[mealID];
	}

	public setMeal(
		newDate: Date | undefined,
		newTitle: string | undefined,
		newLocation: string | undefined,
		newDescription: string | undefined,
		newTime: string
	): void {
		// TODO: update the date and time
		this.setState({ meal: { ...this.state.meal, title: newTitle, location: newLocation, description: newLocation } });
	}

	public render(): JSX.Element {
		return (
			<UserContext.Consumer>
				{userContext => {
					return (
						<div>
							<MediaQuery query="(max-width: 949px)">
								<div>
									<div id="mobileArticle">
										<HostSummaryContainer
											id={this.state.meal.host!.id as number}
											name={`${this.state.meal.host!.firstName} ${this.state.meal.host!.lastName}`}
											about={this.state.meal.host!.about as string}
											imagePath={this.state.meal.host!.imagePath}
											topics={this.state.meal.host!.whitelist || []}
										/>
										<MealDescription
											meal={this.state.meal}
											isGuest={this.state.isGuest}
											setMeal={this.setMeal}
										/>
										<GuestsContainer
											guests={this.state.meal.guests as Partial<User>[]}
											maxGuests={this.state.meal.maxGuests as number}
											isGuest={this.state.isGuest}
										/>
										{/* <MealActionsContainer meal={this.state.meal} setMeal={this.setMeal} /> */}
									</div>
								</div>
							</MediaQuery>

							<MediaQuery query="(min-width: 950px)">
								<div>
									<div id="Article">
										<MealDescription
											meal={this.state.meal}
											isGuest={this.state.isGuest}
											setMeal={this.setMeal}
										/>
									</div>
									<div id="ArticleRight">
										<HostSummaryContainer
											id={this.state.meal.host!.id as number}
											name={`${this.state.meal.host!.firstName} ${this.state.meal.host!.lastName}`}
											about={this.state.meal.host!.about as string}
											imagePath={this.state.meal.host!.imagePath}
											topics={this.state.meal.host!.whitelist || []}
										/>
										<GuestsContainer
											guests={this.state.meal.guests as Partial<User>[]}
											maxGuests={this.state.meal.maxGuests as number}
											isGuest={this.state.isGuest}
										/>
										{/* <MealActionsContainer meal={this.state.meal} setMeal={this.setMeal} /> */}
									</div>
									{/* TODO: If the meal has past, and the context user was a guest => review ability should show */}
								</div>
							</MediaQuery>
						</div>
					);
				}}
			</UserContext.Consumer>
		);
	}
}
