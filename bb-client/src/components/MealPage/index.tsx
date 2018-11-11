// tslint:disable: no-unsafe-any
import { History, Location } from "history";
import React from "react";
import MediaQuery from "react-responsive";
import Meal from "../../entities/Meal";
import User from "../../entities/User";
import MealArticle from "./Center/MealArticle";
import GuestListCard from "./Right/GuestListCard";
import HostCard from "./Right/HostCard";

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
		date: new Date(),
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
				name: "Arroz con pollo",
				description: "Traditional chicken and rice",
			},
			{
				name: "Ropa vieja",
				description: "A classic and a national dish of Cuba",
				timesFavorited: 10,
			},
		],
		price: 40,
		numberOfGuests: 3,
	},
	{
		id: 2,
		host: {
			id: 5,
			firstName: "Jonathan",
			lastName: "Wang",
		},
		date: new Date(),
		location: "College Station, TX",
		title: "Mexican Night Out",
		guests: [],
		numberOfGuests: 4,
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
						<div id="back" onClick={() => { this.props.history.goBack(); }}>
							<h4>GoBack</h4>
						</div>
						<div id="mobileCenter">
							<MealArticle
								meal={this.state.meal}
							/>
							<hr className="seperator" />
							<HostCard
								id={this.state.host.id as number}
								name={`${this.state.host.firstName} ${this.state.host.lastName}` as string}
								about={this.state.host.about as string}
								imagePath={this.state.host.imagePath}
								topics={this.state.host.whitelist || []}
							/>
							<hr className="seperator" />
							<GuestListCard
								guests={this.state.guests}
								numberOfGuests={this.state.meal.numberOfGuests as number}
							/>
						</div>
					</div>
				</MediaQuery>

				<MediaQuery query="(min-width: 950px)">
					<div>
						<div id="Left">
							<div id="back" onClick={() => { this.props.history.goBack(); }}>
								<h4>GoBack</h4>
							</div>
						</div>
						<div id="Center">
							<MealArticle
								meal={this.state.meal}
							/>
						</div>
						<div id="Right">
							<HostCard
								id={this.state.host.id as number}
								name={`${this.state.host.firstName} ${this.state.host.lastName}` as string}
								about={this.state.host.about as string}
								imagePath={this.state.host.imagePath}
								topics={this.state.host.whitelist || []}
							/>
							<hr className="seperator" />
							<GuestListCard
								guests={this.state.guests}
								numberOfGuests={this.state.meal.numberOfGuests as number}
							/>
						</div>
					</div>
				</MediaQuery>
			</div>
		);
	}
}
