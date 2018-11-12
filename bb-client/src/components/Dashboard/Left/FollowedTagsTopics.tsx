import React from "react";
import Tag from "../../../entities/Tag";
import Topic from "../../../entities/Topic";
import "../../resources/css/FollowedTagsTopics.css";
import TagCard from "./TagCard";
import TopicCard from "./TopicCard";

interface IFollowedTagsTopicsProps {
	tags: Partial<Tag>[];
	topics: Partial<Topic>[];
}

export default class FollowedTagsTopics extends React.Component<IFollowedTagsTopicsProps> {
	public render(): JSX.Element {
		return (
			<div id="followed-tags-topics-card" className="followed-tags-topics">
				<div className="card">
					<div className="tagsHeader">Tags</div>
					<ul className="list">
						{this.props.tags.map((tag, i) => {
							return (
								<li className="tags" key={i}>
									<TagCard id={tag.id as number} name={tag.name as string}></TagCard>
								</li>
							);
						})}
					</ul>
				</div>

				<div className="card">
					<div className="tagsHeader">Topics</div>
					<ul className="list">
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

	// public toggleTags(toggleTags: Readonly<string[]>): void {
	// 	this.setState({
	// 		topics: this.state.tags.concat(toggleTags).filter((tag, index, arr) => {
	// 			return arr.indexOf(tag) === index;
	// 		}),
	// 	});
	// }
}
