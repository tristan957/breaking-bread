import React from "react";
import Tag from "../../entities/Tag";
import TagCard from "../cards/TagCard";
import "../resources/css/FollowedTagsCard.css";

interface IFollowedTagsContainerProps {
	tags: Partial<Tag>[];
}

export default class FollowedTagsContainer extends React.Component<IFollowedTagsContainerProps> {
	public render(): JSX.Element {
		return (
			<div id="followed-tags-card" className="followed-tags-card-class">
				<div className="card">
					<div className="tags-topics-list-header">Tags</div>
					<hr className="seperator" />
					<ul className="followed-tags-topics-list">
						{this.props.tags.map((tag, i) => {
							return (
								<li className="tags" key={i}>
									<TagCard id={tag.id as number} name={tag.name as string}></TagCard>
								</li>
							);
						})}
					</ul>
				</div>
			</div>
		);
	}
}
