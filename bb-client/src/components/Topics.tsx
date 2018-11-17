import React from "react";
import Topic from "../entities/Topic";
import { default as TopicComponent } from "./Topic";

interface ITopicsProps {
	userID?: number;
	topics: Partial<Topic>[];
	displayInline?: boolean;
}

export default class Topics extends React.Component<ITopicsProps> {
	public render(): JSX.Element {
		let ulClasses = "no-style-list ";

		if (this.props.displayInline === true) {
			ulClasses += "list-inline";
		}

		return (
			<div>
				<ul className={ulClasses}>
					{this.props.topics.map((topic, i) => {
						return (
							<li key={i}>
								<TopicComponent
									id={topic.id as number}
									name={topic.name as string}
									displayInline={this.props.displayInline}
								/>
							</li>
						);
					})}
				</ul>
			</div>
		);
	}
}
