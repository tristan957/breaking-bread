import React from "react";
import Meal from "../entities/Meal";
import "./resources/css/UpcomingMeals.css";
import UpcomingMealSummary from "./UpcomingMealSummary";

interface IUpcomingMealsProps {
	mealsAttending: Partial<Meal>[];
}

export default class UpcomingMeals extends React.Component<IUpcomingMealsProps> {
	public render(): JSX.Element {
		return (
			<div>
				<ul id="upcoming-meals-list" className="no-style-list">
					{this.props.mealsAttending.map((meal, i) => {
						return (
							<li key={i}>
								<UpcomingMealSummary
									id={meal.id!}
									title={meal.title!}
									price={meal.price || 0}
									startTime={meal.startTime!}
									endTime={meal.endTime!}
									guests={meal.guests || []}
									maxGuests={meal.maxGuests || 0}
									location={meal.location!}
								/>
							</li>
						);
					})}
				</ul>
			</div>
		);
	}
}
