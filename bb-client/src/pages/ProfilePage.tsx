// tslint:disable: no-unsafe-any
import { History, Location } from "history";
import React from "react";
import MediaQuery from "react-responsive";
import ProfileHeader from "../components/ProfileHeader";
import User from "../entities/User";
import "../resources/css/ProfilePage.css";

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
						<div id="ProfileHeader">
							<ProfileHeader
								name={`${this.state.user.firstName} ${this.state.user.lastName}`}
								imagePath={this.state.user.imagePath}
								joinedAt={this.state.user.createdAt as Date}
							/>
						</div>
						<div id="ProfileUnder">  {/* Essentially a mini feed for a specific user */}
							<div id="Left">
							</div>
							<div id="Center"></div>
							<div id="Right">
							</div>
						</div>
					</div>
				</MediaQuery>
			</div>
		);
	}
}
