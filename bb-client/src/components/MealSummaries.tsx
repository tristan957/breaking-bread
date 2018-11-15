import React from "react";
import Meal from "../entities/Meal";

interface IMealSummariesState {
	loadedMeals: Partial<Meal>[];
}

export default class MealSummaries extends React.Component<{}, IMealSummariesState> {
	constructor(props: Readonly<{}>) {
		super(props);

		this.state = {
			loadedMeals: [],
		};
	}

	public render(): JSX.Element {
		return (
			<div>
				<ul>

				</ul>
			</div>
		);
	}
}
