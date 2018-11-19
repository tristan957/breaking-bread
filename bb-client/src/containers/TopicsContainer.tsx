import React from "react";
import Items from "../components/Items";
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
					<Items
						items={this.props.topics}
						leadingChar="#"
					/>
				</div>
			</div>
		);
	}
}
