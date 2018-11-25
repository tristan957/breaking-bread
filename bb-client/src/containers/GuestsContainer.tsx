import React from "react";
import GuestListActions from "../components/GuestListActions";
import ProfileSummaries from "../components/ProfileSummaries";
import User from "../entities/User";
import "./resources/css/GuestsContainer.css";

interface IGuestListContainerProps {
	guests: Partial<User>[];
	maxGuests: number;
	isGuest: boolean;
}

export default class GuestsContainer extends React.Component<IGuestListContainerProps> {
	public render(): JSX.Element {
		return (
			<div className="card cardSubstance">
				<div id="GuestListHeader">
					<h3 id="guest-container-header">Guests</h3><h3 id="guest-container-header"> - {`${this.props.guests.length}/${this.props.maxGuests} 👨`}</h3>
				</div>
				<ProfileSummaries users={this.props.guests} />
				<GuestListActions isGuest={this.props.isGuest} />
			</div >
		);
	}
}
