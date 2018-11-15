import React from "react";
import User from "../../entities/User";
import ProfileSummaryCard from "../cards/ProfileSummaryCard";

interface IGuestsContainerProps {
	guests: Partial<User>[];
	maxGuests: number;
}

export default class GuestsContainer extends React.Component<IGuestsContainerProps> {
	public render(): JSX.Element {
		return (
			<div className="card cardSubstance">
				<div id="GuestListHeader">
					<h3>Guests</h3><h5> - {`${this.props.guests.length}/${this.props.maxGuests} 👨`}</h5>
				</div>
				<ul className="list">
					{this.renderSignUp()}
					<hr className="seperator" />
					{this.props.guests.map((guest, i) => {
						return (
							<div>
								<li className="guest" key={i}>
									<ProfileSummaryCard
										id={guest.id as number}
										name={`${guest.firstName} ${guest.lastName}`}
										imagePath={guest.imagePath}
									/>
								</li>
							</div>
						);
					})}
				</ul>
			</div>
		);
	}

	public renderSignUp(): JSX.Element | undefined {
		// Also need to check conflicts with attendingMeals of current user
		if (this.props.guests.length < this.props.maxGuests) {
			return (
				<div>
					There's room! <button>Sign Up!</button>
				</div>
			);
		}
		// Otherwise render "You're signed up!" if current user is in the Guest list

		return undefined;
	}
}
