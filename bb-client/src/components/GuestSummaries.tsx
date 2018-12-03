import gql from "graphql-tag";
import React from "react";
import { Mutation, MutationFn, MutationResult } from "react-apollo";
import { Button } from "reactstrap";
import User from "../entities/User";
import ProfileSummary from "./ProfileSummary";
import "./resources/css/GuestSummaries.css";

const MEAL_TOGGLE_GUEST = gql`
	mutation MealToggleGuest($mealID: Int!, $guestID: Int!) {
		mealToggleGuest(mealID: $mealID, guestID: $guestID) {
			id
		}
	}
`;

interface IMealToggleGuestData {
	mealToggleGuest: Partial<User>[];
}

interface IMealToggleGuestVariables {
	mealID: number;
	guestID: number;
}

type MealToggleGuestFn = MutationFn<IMealToggleGuestData, IMealToggleGuestVariables>;
type MealToggleGuestResult = MutationResult<IMealToggleGuestData>;

interface IGuestSummariesProps {
	mealID: number;
	guests: Partial<User>[];
	reload?(): void;
}

export default class GuestSummaries extends React.Component<IGuestSummariesProps> {
	public render(): JSX.Element {
		return (
			<div>
				<ul id="guest-summaries" className="no-style-list">
					{this.props.guests.map((guest, i) => {
						return (
							<li key={i} className="guest-summary">
								<ProfileSummary id={guest.id!} name={guest.name!} imagePath={guest.imagePath} />
								{this.props.reload === undefined
									? undefined
									: (
										<Mutation mutation={MEAL_TOGGLE_GUEST} onCompleted={() => this.props.reload!()}>
											{(mealToggleGuest: MealToggleGuestFn, result: MealToggleGuestResult) => {
												if (result.error) {
													console.error(result.error);
													return <div>{result.error.message}</div>;
												}

												return <Button close onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
													mealToggleGuest({ variables: { mealID: this.props.mealID, guestID: guest.id! } });
												}} />;
											}}
										</Mutation>
									)
								}
							</li>
						);
					})}
				</ul>
			</div>
		);
	}
}
