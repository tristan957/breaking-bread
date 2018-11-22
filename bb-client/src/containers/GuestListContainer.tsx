import React from "react";
import GuestListActions from "../components/GuestListActions";
import User from "../entities/User";
import ProfileSummaries from "./ProfileSummaries";

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
					<h3>Guests</h3><h5> - {`${this.props.guests.length}/${this.props.maxGuests} 👨`}</h5>
				</div>
				<ProfileSummaries users={this.props.guests} />
				<GuestListActions isGuest={this.props.isGuest} />
			</div >
		);
	}
}
