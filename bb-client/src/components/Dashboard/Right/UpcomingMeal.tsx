import React from "react";

export interface IUpcomingMealProps {
	id: number;
	location: string;
	imagePath?: string;
	title: string;
	date: Date;
}

export default class UpcomingMeal extends React.Component<IUpcomingMealProps> {
	public render(): JSX.Element {
		return (
			<div>
				<div>{this.props.date.toString()}</div>
				<div>{this.props.title}</div>
				<div>{this.props.location}</div>
				<img src={this.props.imagePath} alt={this.props.title} />
			</div>
		);
	}
}
