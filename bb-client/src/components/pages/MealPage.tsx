// tslint:disable: no-unsafe-any
import { History, Location } from "history";
import React from "react";
import MediaQuery from "react-responsive";
import Meal from "../../entities/Meal";
import User from "../../entities/User";
import HostSummaryCard from "../cards/HostSummaryCard";
import MealDescriptionCard from "../cards/MealDescriptionCard";
import GuestsContainer from "../containers/GuestsContainer";
import "../resources/css/MealPage.css";

const loadedMeals: Partial<Meal>[] = [
	{
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
];

interface IMealPageProps {
	history: History;
	location: Location;
	match: {
		params: {
			mealID: number;
			hostID: number;
		};
	};
}

interface IMealPageState {
	meal: Partial<Meal>;
	host: Partial<User>;
	guests: Partial<User>[];
}

export default class MealPage extends React.Component<IMealPageProps, IMealPageState> {
	constructor(props: IMealPageProps) {
		super(props);

		this.state = {
			meal: {},
			host: {},
			guests: [{}],
		};
	}

	public componentWillMount(): void {
		// TODO: Fetch meal from server based on mealID
		const meal: Partial<Meal> = loadedMeals[this.props.match.params.mealID - 1];
		this.setState({
			meal,
			host: meal.host as User,
			guests: meal.guests as User[],
		});
	}

	public render(): JSX.Element {
		return (
			<div>
				<MediaQuery query="(max-width: 949px)">
					<div>
						<div id="mobileArticle">
							<MealDescriptionCard
								meal={this.state.meal}
							/>
							<HostSummaryCard
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
							<MealDescriptionCard
								meal={this.state.meal}
							/>
						</div>
						<div id="ArticleRight">
							<HostSummaryCard
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
			</div>
		);
	}
}
