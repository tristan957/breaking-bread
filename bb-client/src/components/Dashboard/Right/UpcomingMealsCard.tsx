import React from "react";
import UpcomingMeal, { IUpcomingMealProps } from "./UpcomingMeal";

interface IUpcomingMealsProps {
	upcomingMeals: IUpcomingMealProps[];
}

export default class UpcomingMeals extends React.Component<IUpcomingMealsProps> {
	public render(): JSX.Element {
		return (
			<div>
				<ul>
					{this.props.upcomingMeals.map(meal => {
						return <li><UpcomingMeal id={meal.id} title={meal.title} location={meal.location} imagePath={meal.imagePath} date={meal.date} /></li>;
					})}
				</ul>
			</div>
		);
	}
}
