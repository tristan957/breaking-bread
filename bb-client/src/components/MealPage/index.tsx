// tslint:disable: no-unsafe-any
import { History, Location } from "history";
import React from "react";

interface IMealProps {
	history: History;
	location: Location;
	match: {
		params: {
			mealID: number;
			hostID: number;
		};
	};
}

export default class MealPage extends React.Component<IMealProps> {
	public render(): JSX.Element {
		return (
			<div>
				<div onClick={() => { this.props.history.goBack(); }}>
					<h3>{this.props.match.params.mealID}</h3>
					<h3>a{console.log(this.props)}</h3>
				</div>
			</div>
		);
	}
}
