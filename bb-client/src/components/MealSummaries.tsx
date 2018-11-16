import React from "react";
import Meal from "../entities/Meal";
import User from "../entities/User";
import MealSummary from "./MealSummary";

interface IMealSummariesProps {
	meals: Partial<Meal>[];
	showHosts?: boolean;
}

export default class MealSummaries extends React.Component<IMealSummariesProps> {
	public render(): JSX.Element {
		return (
			<div>
				<ul className="no-style-list">
					{
						this.props.meals.map((meal, i) => {
							return (
								<li key={i}>
									<MealSummary
										id={meal.id as number}  // TODO: Reconsider all casts considering this is a partial meal
										location={meal.location || ""}
										host={meal.host as User}
										imagePath={meal.imagePath}
										title={meal.title || ""}
										description={meal.description || ""}
										date={meal.date as Date}
										guests={meal.guests || []}
										maxGuests={meal.maxGuests as number}
										price={meal.price}
										showHost={this.props.showHosts}
									/>
								</li>
							);
						})
					}
				</ul>
			</div>
		);
	}
}
