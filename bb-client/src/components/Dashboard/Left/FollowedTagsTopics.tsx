import React from "react";

interface IFollowedTagsTopicsProps {
	tags: string[];
	topics: string[];
}

export default class FollowedTagsTopics extends React.Component<IFollowedTagsTopicsProps> {
	public render(): JSX.Element {
		return (
			<div id="followed-tags-topics-card" className="followed-tags-topics card">
				<div className="header">Tags</div>
				<ul className="list">
					{this.props.tags.map(tag => {
						return <li className="tag">{`#${tag}`}</li>;
					})}
				</ul>
				<hr className="seperator" />
				<div className="header">Topics</div>
				<ul className="list">
					{this.props.topics.map(topic => {
						return <li className="topic">{`#${topic}`}</li>;
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
