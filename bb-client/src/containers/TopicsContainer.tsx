import React from "react";
import Topics from "../components/Topics";
import Topic from "../entities/Topic";
import "./resources/css/TopicsContainer.css";

interface ITopicsContainerProps {
	topics: Partial<Topic>[];
}

export default class TopicsContainer extends React.Component<ITopicsContainerProps> {
	public render(): JSX.Element {
		return (
			<div id="followed-topics-card" className="followed-topics-card">
				<div className="card">
					<div className="tags-topics-list-header container-header">Topics</div>
					<hr className="seperator" />
					<Topics {...this.props} />
				</div>
			</div>
		);
	}
}
