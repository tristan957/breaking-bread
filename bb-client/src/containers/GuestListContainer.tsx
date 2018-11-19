import React from "react";
import GuestListActions from "../components/GuestListActions";
import ProfileList from "../components/ProfileList";
import User from "../entities/User";

interface IGuestListContainerProps {
	guests: Partial<User>[];
	maxGuests: number;
	isGuest: boolean
}

export default class GuestsContainer extends React.Component<IGuestListContainerProps> {
	public render(): JSX.Element {
		return (
			<div className="card cardSubstance">
				<div id="GuestListHeader">
					<h3>Guests</h3><h5> - {`${this.props.guests.length}/${this.props.maxGuests} 👨`}</h5>
				</div>
				<ProfileList users={this.props.guests} />
				<GuestListActions isGuest={this.props.isGuest} />
			</div >
		);
	}
}
