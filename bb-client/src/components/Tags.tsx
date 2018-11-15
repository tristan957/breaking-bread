import React from "react";
import Tag from "../entities/Tag";
import { default as TagComponent } from "./Tag";

interface ITagsProps {
	tags: Partial<Tag>[];
}

export default class Tags extends React.Component<ITagsProps> {
	public render(): JSX.Element {
		return (
			<div>
				<ul>
					{this.props.tags.map((tag, i) => {
						<li key={i}>
							<TagComponent
								id={tag.id as number}
								name={tag.name as string}
							/>
						</li>;
					})}
				</ul>
			</div>
		);
	}
}
