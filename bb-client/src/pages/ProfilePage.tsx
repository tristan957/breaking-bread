// tslint:disable: no-unsafe-any
import { History, Location } from "history";
import React from "react";
import MediaQuery from "react-responsive";
import ProfileHeader from "../components/ProfileHeader";
import ProfileActivityContainer from "../containers/ProfileActivityContainer";
import User from "../entities/User";
import "./resources/css/ProfilePage.css";

const loadedUser: Partial<User> = {
	id: 3,
	firstName: "Fank",
	lastName: "Food",
	about: "I like to cook Cuban",
	createdAt: new Date("September 15, 2018 18:30:00"),
	whitelist: [
		{
			id: 10,
			name: "Pandas",
		},
	],
	hostedMeals: [
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
	mealsAttending: [
		{
			id: 2,
			host: {
				id: 4,
				firstName: "than",
				lastName: "Wng",
			},
			date: new Date("December 17, 2017 19:24:00"),
			location: " Station, TX",
			title: "Mn Night Out",
			guests: [],
			maxGuests: 2,
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
};

interface IProfilePageProps {
	history: History;
	location: Location;
	match: {
		params: {
			userID: number;
		};
	};
}

interface IProfilePageState {
	user: Partial<User>;
}

export default class ProfilePage extends React.Component<IProfilePageProps, IProfilePageState> {
	constructor(props: IProfilePageProps) {
		super(props);

		this.state = {
			user: {},
		};

		this.getUserReviewAverage = this.getUserReviewAverage.bind(this);
	}

	private getUserReviewAverage(): number {
		if (this.state.user.reviews === undefined || this.state.user.reviews.length === 0) {
			return 0;
		}

		let sum = 0;
		let effectiveLength = 0;
		this.state.user.reviews.forEach(element => {
			if (element.rating !== undefined) {
				sum += element.rating;
				effectiveLength += 1;
			}
		});

		return sum / effectiveLength;
	}

	public componentWillMount(): void {
		// TODO: Fetch meal from server based on mealID
		const user: Partial<User> = loadedUser;
		this.setState({
			user,
		});
	}

	public render(): JSX.Element {
		return (
			<div>
				<MediaQuery query="(max-width: 949px)">
					<div>
						<div id="profile-header">
						</div>
					</div>
				</MediaQuery>

				<MediaQuery query="(min-width: 950px)">
					<div>
						<div id="profile-header">
							{/* TODO: Need followed tags */}
							<ProfileHeader
								name={`${this.state.user.firstName} ${this.state.user.lastName}`}
								about={this.state.user.about as string}
								whiteList={this.state.user.whitelist || []}
								blackList={this.state.user.blacklist || []}
								imagePath={this.state.user.imagePath}
								joinedAt={this.state.user.createdAt as Date}
								reviewAverage={this.getUserReviewAverage()}
							/>
						</div>
						<div id="profile-under">  {/* Essentially a mini feed for a specific user */}
							<div>
							</div>
							<div>
								<ProfileActivityContainer
									hostedMeals={this.state.user.hostedMeals || []}
									authoredRecipes={this.state.user.recipesAuthored || []}
									favoriteRecipes={this.state.user.favoriteRecipes || []}
									favoriteUsers={this.state.user.favoriteUsers || []}
								/>
							</div>
							<div>
							</div>
							{/* TODO: If this isn't current user, and you have been in a meal with them => show ability to review, or show previous for editing */}
						</div>
					</div>
				</MediaQuery>
			</div>
		);
	}
}
