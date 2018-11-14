import React from "react";
import Tag from "../../entities/Tag";
import Topic from "../../entities/Topic";
import "../../resources/css/FollowedTagsCard.css";
import TagCard from "../cards/TagCard";
import TopicCard from "../cards/TopicCard";

interface IFollowedTagsCardProps {
	tags: Partial<Tag>[];
	topics: Partial<Topic>[];
}

export default class FollowedTagsCard extends React.Component<IFollowedTagsCardProps> {
	public render(): JSX.Element {
		return (
			<div id="followed-tags-card" className="followed-tags-card-class">
				<div className="card">
					<div className="tagsHeader">Tags</div>
					<hr className="seperator" />
					<ul className="followed-tags-card-list">
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
					<hr className="seperator" />
					<ul className="followed-tags-card-list">
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
