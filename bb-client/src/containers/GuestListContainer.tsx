import React from "react";
import GuestList from "../components/GuestList";
import User from "../entities/User";

interface IGuestListContainerProps {
	guests: Partial<User>[];
	maxGuests: number;
}

export default class GuestsContainer extends React.Component<IGuestListContainerProps> {
	public render(): JSX.Element {
		return (
			<div className="card cardSubstance">
				<div id="GuestListHeader">
					<h3>Guests</h3><h5> - {`${this.props.guests.length}/${this.props.maxGuests} 👨`}</h5>
				</div>
				<GuestList {...this.props} />
				{/* <ul className="list">
					{this.renderSignUp()}
					<hr className="seperator" />
					{this.props.guests.map((guest, i) => {
						return (
							<div>
								<li className="guest" key={i}>
									<GuestCard
										id={guest.id as number}
										name={`${guest.firstName} ${guest.lastName}`}
										imagePath={guest.imagePath}
									/>
								</li>
							</div>
						);
					})}
				</ul> */}
			</div >
		);
	}
}
