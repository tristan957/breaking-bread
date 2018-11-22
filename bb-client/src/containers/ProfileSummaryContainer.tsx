import React from "react";
import ProfileSummary from "../components/ProfileSummary";
import User from "../entities/User";

interface IProfileSummaryProps {
	user: Partial<User>;
}

export default class ProfileSummaryContainer extends React.Component<IProfileSummaryProps> {
	public render(): JSX.Element {
		return (
			<div className="card">
				<ProfileSummary
					id={this.props.user.id as number}
					name={`${this.props.user.firstName} ${this.props.user.lastName}`}
					imagePath={this.props.user.imagePath}
				/>
			</div>
		);
	}
}
