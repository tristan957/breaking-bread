import React from "react";
import Items from "../components/Items";
import Tag from "../entities/Tag";
import "./resources/css/TagsContainer.css";

interface ITagsContainerProps {
	tags: Partial<Tag>[];
}

export default class TagsContainer extends React.Component<ITagsContainerProps> {
	public render(): JSX.Element {
		return (
			<div id="followed-tags-card" className="followed-tags-card-class">
				<div className="card">
					<div id="tags-topics-list-header" className="container-header">Tags</div>
					<hr className="separator" />
					<Items
						items={this.props.tags}
						leadingChar="#"
					/>
				</div>
			</div >
		);
	}
}
