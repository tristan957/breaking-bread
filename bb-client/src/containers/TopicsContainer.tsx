import React from "react";
import Topics from "../components/Topics";
import Topic from "../entities/Topic";
import "../resources/css/containers/FollowedTopicsContainer.css";

interface ITopicsContainerProps {
	topics: Partial<Topic>[];
}

export default class TopicsContainer extends React.Component<ITopicsContainerProps> {
	public render(): JSX.Element {
		return (
			<div id="followed-topics-card" className="followed-topics-card">
				<div className="card">
					<div className="tags-topics-list-header">Topics</div>
					<hr className="seperator" />
					<Topics {...this.props} />
					{/* <ul className="followed-tags-topics-list">
						{this.props.topics.map((topic, i) => {
							return (
								<li className="tags" key={i}>
									<TopicCard id={topic.id as number} name={topic.name as string}></TopicCard>
								</li>
							);
						})}
					</ul> */}
				</div>
			</div>
		);
	}
}
