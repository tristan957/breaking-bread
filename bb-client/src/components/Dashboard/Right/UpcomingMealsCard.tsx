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
									title={"This is a meal."} // TODO: fillin with actual
									location={meal.location as string}
									imagePath={undefined}
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
