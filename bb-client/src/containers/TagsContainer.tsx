import React from "react";
import Tags from "../components/Tags";
import Tag from "../entities/Tag";
import "../resources/css/containers/FollowedTagsContainer.css";

interface ITagsContainerProps {
	tags: Partial<Tag>[];
}

export default class TagsContainer extends React.Component<ITagsContainerProps> {
	public render(): JSX.Element {
		return (
			<div id="followed-tags-card" className="followed-tags-card-class">
				<div className="card">
					<div className="tags-topics-list-header">Tags</div>
					<hr className="seperator" />
					<Tags {...this.props} />
					{/* <ul className="followed-tags-topics-list">
						{this.props.tags.map((tag, i) => {
							return (
								<li className="tags" key={i}>
									<TagCard id={tag.id as number} name={tag.name as string}></TagCard>
								</li>
							);
						})}
					</ul> */}
				</div>
			</div>
		);
	}
}
