// tslint:disable: no-unsafe-any
import React from "react";
import User from "../entities/User";
import ProfileSummary from "./ProfileSummary";

interface IProfileListProps {
	users: Partial<User>[];
}

export default class ProfileList extends React.Component<IProfileListProps> {
	public render(): JSX.Element {
		return (
			// TODO: Link to user page
			// TODO: Show kickable button if host of meal
			<div>
				<ul>
					{this.props.users.map((user, i) => {
						<li key={i}>
							<ProfileSummary id={user.id as number} name={`${user.firstName} ${user.lastName}`} imagePath={user.imagePath} />
						</li>;
					})}
				</ul>
			</div>
		);
	}
}
