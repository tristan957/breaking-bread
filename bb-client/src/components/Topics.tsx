import React from "react";
import Topic from "../entities/Topic";
import { default as TopicComponent } from "./Topic";

interface ITopicsProps {
	userID?: number;
	topics: Partial<Topic>[];
}

export default class Topics extends React.Component<ITopicsProps> {
	public render(): JSX.Element {
		return (
			<div>
				<ul className="no-style-list">
					{this.props.topics.map((topic, i) => {
						return (
							<li key={i}>
								<TopicComponent
									id={topic.id as number}
									name={topic.name as string}
								/>
							</li>
						);
					})}
				</ul>
			</div>
		);
	}
}
