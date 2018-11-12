import React from "react";
import Meal from "../../../entities/Meal";
import "../../resources/css/UpcomingMealsCard.css";
import UpcomingMeal from "./UpcomingMeal";

interface IUpcomingMealsProps {
	mealsAttending: Partial<Meal>[];
}

export default class UpcomingMealsCard extends React.Component<IUpcomingMealsProps> {
	public render(): JSX.Element {
		return (
			<div className="upcomingMealCard">
				<ul>
					{this.props.mealsAttending.map((meal, i) => {
						return (
							<li key={i}>
								<UpcomingMeal
									id={meal.id as number}
									title={meal.title as string} // TODO: fillin with actual
									price={meal.price as number}
									guests={meal.guests || []}
									maxGuests={meal.maxGuests as number}
									location={meal.location as string}
									date={meal.date as Date}
								/>
							</li>
						);
					})}
				</ul>
			</div >
		);
	}
}
