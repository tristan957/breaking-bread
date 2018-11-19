// tslint:disable: no-unsafe-any
import React from "react";
import MediaQuery from "react-responsive";
import { RouteComponentProps } from "react-router";
import { UserContext } from "../App";
import ProfileActivityContainer from "../containers/ProfileActivityContainer";
import ProfileHeader from "../containers/ProfileHeaderContainer";
import User from "../entities/User";
import "./resources/css/ProfilePage.css";

interface IProfilePageParams {
	userID?: string;
}

interface IProfilePageState {
	userBeingViewed: Partial<User>;
}

export default class ProfilePage extends React.Component<RouteComponentProps<IProfilePageParams>, IProfilePageState> {
	constructor(props: RouteComponentProps<IProfilePageParams>) {
		super(props);

		this.fetchUserFromParams = this.fetchUserFromParams.bind(this);
		this.getUserReviewAverage = this.getUserReviewAverage.bind(this);

		this.state = {
			userBeingViewed: this.fetchUserFromParams(),
		};
	}

	private fetchUserFromParams(): Partial<User> {
		const date = new Date("November 15, 2008 18:30:00");
		return {
			id: 3,
			firstName: "Fank",
			lastName: "Food",
			about: "I like to cook Cuban",
			createdAt: date,
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
		};
	}

	private getUserReviewAverage(): number {
		if (this.state.userBeingViewed.reviews === undefined || this.state.userBeingViewed.reviews.length === 0) {
			return 0;
		}

		let sum = 0;
		let effectiveLength = 0;
		this.state.userBeingViewed.reviews.forEach(element => {
			if (element.rating !== undefined) {
				sum += element.rating;
				effectiveLength += 1;
			}
		});

		return sum / effectiveLength;
	}

	public render(): JSX.Element {
		return (
			<UserContext.Consumer>
				{userContext => {
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
											name={`${this.state.userBeingViewed.firstName} ${this.state.userBeingViewed.lastName}`}
											about={this.state.userBeingViewed.about as string}
											whiteList={this.state.userBeingViewed.whitelist || []}
											blackList={this.state.userBeingViewed.blacklist || []}
											imagePath={this.state.userBeingViewed.imagePath}
											joinedAt={this.state.userBeingViewed.createdAt as Date}
											reviewAverage={this.getUserReviewAverage()}
											timesFavorited={this.state.userBeingViewed.timesFavorited as number}
										/>
									</div>
									<div id="profile-under">  {/* Essentially a mini feed for a specific user */}
										<div>
										</div>
										<div>
											<ProfileActivityContainer
												hostedMeals={this.state.userBeingViewed.hostedMeals || []}
												authoredRecipes={this.state.userBeingViewed.recipesAuthored || []}
												favoriteRecipes={this.state.userBeingViewed.favoriteRecipes || []}
												favoriteUsers={this.state.userBeingViewed.favoriteUsers || []}
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
				}}
			</UserContext.Consumer>
		);
	}
}
