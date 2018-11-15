// tslint:disable: no-unsafe-any
import React from "react";
import { Link } from "react-router-dom";
import User from "../entities/User";
import ProfileSummary from "./ProfileSummary";

interface IGuestListProps {
	guests: Partial<User>[];
}

export default class GuestList extends React.Component<IGuestListProps> {
	public render(): JSX.Element {
		return (
			// TODO: Link to user page
			// TODO: Show kickable button if host of meal
			<div>
				<ul>
					{this.props.guests.map((user, i) => {
						<li key={i}>
							<Link to={`/p/${user.id}`}>
								<ProfileSummary
									id={user.id as number}
									name={`${user.firstName} ${user.lastName}`}
									imagePath={user.imagePath}
									disableImageRender={true}
								/>
								{/* <div id="profile-card" className="profile card no-link">
									<div id="username" className="profile">
										<img id="picture" className="profile" src={this.props.imagePath === undefined ? defaultUserPic : this.props.imagePath} alt="Profile Picture" />
										{this.props.name}
									</div>
								</div> */}
							</Link>
						</li>;
					})}
				</ul>
			</div>
		);
	}
}
