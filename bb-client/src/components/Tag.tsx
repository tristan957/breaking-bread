// tslint:disable: no-unsafe-any
import React from "react";

interface ITagProps {
	id: number;
	name: string;
}

export default class Tag extends React.Component<ITagProps> {
	public render(): JSX.Element {
		return (
			// TODO: Click to filter Tag?
			// TODO: Show x to unfollow modal
			// TODO: If shown and followed (show x to unfollow) if shown and not followed (show + to follow)
			<div id="tag-card" className="tag">
				<div id="tag" className="tag">#{this.props.name}</div>
			</div>
		);
	}
}
