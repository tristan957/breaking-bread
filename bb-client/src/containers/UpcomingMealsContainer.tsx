import React from "react";
import UpcomingMeals from "../components/UpcomingMeals";
import Meal from "../entities/Meal";

interface IUpcomingMealsContainerProps {
	mealsAttending: Partial<Meal>[];
}

export default class UpcomingMealsContainer extends React.Component<IUpcomingMealsContainerProps> {
	public render(): JSX.Element {
		return (
			<div className="card container">
				<UpcomingMeals {...this.props} />
			</div>
		);
	}
}
