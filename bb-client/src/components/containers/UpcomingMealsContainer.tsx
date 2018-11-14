import React from "react";
import Meal from "../../entities/Meal";
import UpcomingMealSummaryCard from "../cards/UpcomingMealSummaryCard";
import "../resources/css/UpcomingMealsCard.css";

interface IUpcomingMealsContainerProps {
	mealsAttending: Partial<Meal>[];
}

export default class UpcomingMealsContainer extends React.Component<IUpcomingMealsContainerProps> {
	private renderUpcoming(): JSX.Element {
		if (this.props.mealsAttending.length > 0) {
			this.props.mealsAttending.sort((a: Partial<Meal>, b: Partial<Meal>) => {
				if (a.date === undefined || b.date === undefined) {
					return 0;
				}
				return a.date.valueOf() - b.date.valueOf();
			});

			return (
				<ul>
					{this.props.mealsAttending.map((meal, i) => {
						return (
							<li key={i} className="upcomingMealListItem">
								<UpcomingMealSummaryCard
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
			);
		}

		return (
			<div className="noDice">🤷 Nada!</div>
		);
	}

	public render(): JSX.Element {
		return (
			<div className="card">
				<h4 id="upcomingMealHeader">My upcoming meals</h4>
				<hr className="seperator" />
				{this.renderUpcoming()}
			</div >
		);
	}
}
