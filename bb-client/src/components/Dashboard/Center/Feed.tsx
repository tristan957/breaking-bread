import React from "react";
import Meal from "../../../entities/Meal";
import User from "../../../entities/User";
import "../../resources/css/Feed.css";
import MealCard from "./MealCard";

interface IFeedState {
	loadedMeals: Partial<Meal>[];
}

export default class Feed extends React.Component<{}, IFeedState> {
	constructor(props: Readonly<{}>) {
		super(props);

		this.state = {
			loadedMeals: [],
		};
	}

	public componentWillMount(): void {
		// TODO: fetch last 25 meals from server
		// TODO: recommender system
		this.setState({
			loadedMeals: [
				{
					id: 1,
					host: {
						id: 3,
						firstName: "Fank",
						lastName: "Food",
					},
					date: new Date(),
					location: "College Station, TX",
					title: "Cuban delight",
					guests: [
						{
							id: 4,
							firstName: "Micky",
							lastName: "Li",
						},
					],
					price: 40,
					numberOfGuests: 3,
				},
				{
					id: 2,
					host: {
						id: 5,
						firstName: "Jonathan",
						lastName: "Wang",
					},
					date: new Date(),
					location: "College Station, TX",
					title: "Mexican Night Out",
					guests: [],
					numberOfGuests: 4,
				},
			],
		});
	}

	public render(): JSX.Element {
		return (
			<div>
				<ul>
					{
						this.state.loadedMeals.map((meal, i) => {
							return (
								<li key={i} className="feedCard">
									<MealCard
										id={meal.id as number}  // TODO: Reconsider all casts considering this is a partial meal
										location={meal.location || ""}
										host={meal.host as User}
										imagePath={meal.imagePath}
										title={meal.title || ""}
										description={meal.description || ""}
										date={meal.date as Date}
										guests={meal.guests || []}
										numberOfGuests={meal.numberOfGuests as number}
										price={meal.price}
									/>
								</li>
							);
						})
					}
				</ul>
			</div >
		);
	}
}
