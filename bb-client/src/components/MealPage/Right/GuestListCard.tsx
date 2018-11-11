import React from "react";
import User from "../../../entities/User";
import GuestCard from "./GuestCard";

interface IGuestListCardProps {
	guests: Partial<User>[];
	numberOfGuests: number;
}

export default class GuestListCard extends React.Component<IGuestListCardProps> {
	public render(): JSX.Element {
		return (
			<div>
				<ul className="list">
					<div className="meal-card-guest-count">{`${this.props.guests.length}/${this.props.numberOfGuests} 👨`}</div>
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
					{/* TODO: If there is still room, and a user is signed in, and doesn't have a meal attending conflict, display signup for meal button */}
				</ul>
			</div>
		);
	}
}
