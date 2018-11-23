import React from "react";
import ProfileSummary from "../components/ProfileSummary";
import User from "../entities/User";

interface IProfileSummariesProps {
	users: Partial<User>[];
	showAsCards?: boolean;
}

export default class ProfileSummaries extends React.Component<IProfileSummariesProps> {
	public render(): JSX.Element {
		return (
			<div>
				<ul className="no-style-list">
					{this.props.users.map((user, i) => {
						return (
							this.props.showAsCards !== true
								? (
									<li key={i}>
										<ProfileSummary id={user.id as number} name={`${user.firstName} ${user.lastName}`} imagePath={user.imagePath} />
									</li>
								)
								: (
									<li key={i} className="card">
										<ProfileSummary id={user.id as number} name={`${user.firstName} ${user.lastName}`} imagePath={user.imagePath} />
									</li>
								)
						);
					})}
				</ul>
			</div>
		);
	}
}
