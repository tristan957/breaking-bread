import React from "react";
import Tag from "../../../entities/Tag";
import Topic from "../../../entities/Topic";
import TagCard from "./TagCard";
import TopicCard from "./TopicCard";

interface IFollowedTagsTopicsProps {
	tags: Partial<Tag>[];
	topics: Partial<Topic>[];
}

export default class FollowedTagsTopics extends React.Component<IFollowedTagsTopicsProps> {
	public render(): JSX.Element {
		return (
			<div id="followed-tags-topics-card" className="followed-tags-topics card">
				<div className="header">Tags</div>
				<ul className="list">
					{this.props.tags.map((tag, i) => {
						return (
							<li className="tag" key={i}>
								<TagCard id={tag.id as number} name={tag.name as string}></TagCard>
							</li>
						);
					})}
				</ul>
				<hr className="seperator" />
				<div className="header">Topics</div>
				<ul className="list">
					{this.props.topics.map((topic, i) => {
						console.log(topic);
						return (
							<li className="topic" key={i}>
								<TopicCard id={topic.id as number} name={topic.name as string}></TopicCard>
							</li>
						);
					})}
				</ul>
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
