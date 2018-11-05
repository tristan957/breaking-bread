import React from "react";
import Meal from "../../../entities/Meal";
import MealCard from "./MealCard";

export default class Feed extends React.Component {
	private loadedMeals?: Partial<Meal>[];

	public componentWillMount(): void {
		// TODO: fetch last 25 meals from server
		// TODO: recommender system
		this.loadedMeals = [
			{
				id: 1,
				hostID: 1,
				date: new Date(),
				location: "College Station, TX",
				title: "Cuban delight",
				guestIDs: [1, 2],
				numberOfGuests: 3,
			},
			{
				id: 2,
				hostID: 2,
				date: new Date(),
				location: "College Station, TX",
				title: "Mexican Night Out",
				guestIDs: [],
				numberOfGuests: 4,
			},
		];
	}

	public render(): JSX.Element {
		return (
			<div>
				<div>Feed</div>
				<ul>
					{
						this.loadedMeals === undefined ? undefined :
							this.loadedMeals.map((meal, i) => {
								return (
									<li key={i}>
										<MealCard
											id={meal.id as number}
											location={meal.location as string}
											imagePath={meal.imagePath as string}
											title={meal.title as string}
											description={meal.description as string}
											date={meal.date as Date}
											guestIDs={meal.guestIDs as number[]}
											numberOfGuests={meal.numberOfGuests as number}
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
