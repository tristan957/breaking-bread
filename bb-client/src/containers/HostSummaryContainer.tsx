// tslint:disable: no-unsafe-any
import React from "react";
import HostSummary from "../components/HostSummary";
import Topic from "../entities/Topic";

interface IHostSummaryContainerProps {
	id: number;
	name: string;
	about?: string;
	imagePath?: string;
	topics: Partial<Topic>[];
}

export default class HostSummaryContainer extends React.Component<IHostSummaryContainerProps> {
	public render(): JSX.Element {
		return (
			<div id="profile-card" className="profile card no-link">
				<HostSummary
					{...this.props}
				/>
			</div>
		);
	}
}
