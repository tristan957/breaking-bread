import React from "react";
import Topic from "../../entities/Topic";
import TopicCard from "../cards/TopicCard";
import "../resources/css/FollowedTagsCard.css";

interface IFollowedTopicsContainerProps {
	topics: Partial<Topic>[];
}

export default class FollowedTopicsContainer extends React.Component<IFollowedTopicsContainerProps> {
	public render(): JSX.Element {
		return (
			<div id="followed-topics-card" className="followed-topics-card">
				<div className="card">
					<div className="tags-topics-list-header">Topics</div>
					<hr className="seperator" />
					<ul className="followed-tags-topics-list">
						{this.props.topics.map((topic, i) => {
							return (
								<li className="tags" key={i}>
									<TopicCard id={topic.id as number} name={topic.name as string}></TopicCard>
								</li>
							);
						})}
					</ul>
				</div>
			</div>
		);
	}
}
