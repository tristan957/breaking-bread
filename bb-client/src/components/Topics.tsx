import React from "react";
import Topic from "../entities/Topic";
import { default as TopicComponent } from "./Topic";

interface ITopicsProps {
	userID?: number;
}

interface ITopicsState {
	topics: Partial<Topic>[];
}

export default class Topics extends React.Component<ITopicsProps, ITopicsState> {
	constructor(props: ITopicsProps) {
		super(props);

		this.state = {
			topics: [],
		};
	}

	public componentWillMount(): void {
		this.setState({
			topics: [
				{
					id: 1,
					name: "vegan",
				},
				{
					id: 2,
					name: "vegetarian",
				},
			],
		});
	}

	public render(): JSX.Element {
		return (
			<div>
				<ul>
					{this.state.topics.map((topic, i) => {
						<li key={i}>
							<TopicComponent
								id={topic.id as number}
								name={topic.name as string}
							/>
						</li>;
					})}
				</ul>
			</div>
		);
	}
}
