import React from "react";
import Tag from "../entities/Tag";
import { default as TagComponent } from "./Tag";

interface ITagsProps {
	userID?: number;
	tags: Partial<Tag>[];
	displayInline?: boolean;
}

export default class Tags extends React.Component<ITagsProps> {
	public render(): JSX.Element {
		let ulClasses = "no-style-list ";

		if (this.props.displayInline === true) {
			ulClasses += "list-inline";
		}

		return (
			<div>
				<ul className={ulClasses}>
					{this.props.tags.map((tag, i) => {
						return (
							<li key={i}>
								<TagComponent
									id={tag.id as number}
									name={tag.name as string}
								/>
							</li>
						);
					})}
				</ul>
			</div>
		);
	}
}
