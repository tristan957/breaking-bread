// tslint:disable: no-unsafe-any
import React from "react";
import MediaQuery from "react-responsive";
import { RouteComponentProps } from "react-router-dom";
import { UserContext } from "../App";
import HostSummary from "../components/HostSummary";
import MealDescription from "../components/MealDescription";
import GuestsContainer from "../containers/GuestListContainer";
import Meal from "../entities/Meal";
import User from "../entities/User";
import "./resources/css/MealPage.css";

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
	userLoggedIn?: Partial<User>;
	meal: Partial<Meal>;
	host: Partial<User>;
	guests: Partial<User>[];
}

export default class MealPage extends React.Component<RouteComponentProps<IMealPageParams>, IMealPageState> {
	constructor(props: RouteComponentProps<IMealPageParams>) {
		super(props);

		this.fetchMealFromParams = this.fetchMealFromParams.bind(this);
	}

	private fetchMealFromParams(): Partial<Meal> {
		const mealID: number = parseInt(this.props.match.params.mealID, 10); // +1 for array
		return loadedMeals[mealID];
	}

	public render(): JSX.Element {
		return (
			<UserContext.Consumer>
				{userContext => {
					const currentMeal: Partial<Meal> = this.fetchMealFromParams();
					if (currentMeal.host === undefined || currentMeal.guests === undefined) {
						return undefined;
					}

					this.state = {
						userLoggedIn: userContext.user,
						meal: currentMeal,
						host: currentMeal.host as Partial<User>,
						guests: currentMeal.guests as Partial<User>[],
					};

					return (
						<div>
							<MediaQuery query="(max-width: 949px)">
								<div>
									<div id="mobileArticle">
										<MealDescription
											meal={this.state.meal}
										/>
										<HostSummary
											id={this.state.host.id as number}
											name={`${this.state.host.firstName} ${this.state.host.lastName}` as string}
											about={this.state.host.about as string}
											imagePath={this.state.host.imagePath}
											topics={this.state.host.whitelist || []}
										/>
										<GuestsContainer
											guests={this.state.guests}
											maxGuests={this.state.meal.maxGuests as number}
										/>
									</div>
								</div>
							</MediaQuery>

							<MediaQuery query="(min-width: 950px)">
								<div>
									<div id="Article">
										<MealDescription
											meal={this.state.meal}
										/>
									</div>
									<div id="ArticleRight">
										<HostSummary
											id={this.state.host.id as number}
											name={`${this.state.host.firstName} ${this.state.host.lastName}` as string}
											about={this.state.host.about as string}
											imagePath={this.state.host.imagePath}
											topics={this.state.host.whitelist || []}
										/>
										<GuestsContainer
											guests={this.state.guests}
											maxGuests={this.state.meal.maxGuests as number}
										/>
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
