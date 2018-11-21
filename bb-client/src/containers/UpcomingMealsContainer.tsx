import React from "react";
import UpcomingMeals from "../components/UpcomingMeals";
import Meal from "../entities/Meal";
import "./resources/css/UpcomingMealsContainer.css";

interface IUpcomingMealsContainerProps {
	mealsAttending: Partial<Meal>[];
}

export default class UpcomingMealsContainer extends React.Component<IUpcomingMealsContainerProps> {
	public render(): JSX.Element {
		return (
			<div className="card">
				<div className="container-header">Your Upcoming Meals</div>
				<hr className="separator" />
				<UpcomingMeals {...this.props} />
			</div>
		);
	}
}
