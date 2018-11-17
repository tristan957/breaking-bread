import React from "react";
import MealSummary from "../components/MealSummary";
import Meal from "../entities/Meal";
import User from "../entities/User";

interface IMealSummaryContainerProps {
	showHost?: boolean;
	meal: Partial<Meal>;
}

export default class MealSummaryContainer extends React.Component<IMealSummaryContainerProps> {
	public render(): JSX.Element {
		return (
			<div className="card">
				<MealSummary
					id={this.props.meal.id as number}
					location={this.props.meal.location as string}
					imagePath={this.props.meal.imagePath}
					title={this.props.meal.title as string}
					description={this.props.meal.description as string}
					host={this.props.meal.host as User}
					date={this.props.meal.date as Date}
					guests={this.props.meal.guests || []}
					maxGuests={this.props.meal.maxGuests || 0}
					price={this.props.meal.price || 0}
					showHost={this.props.showHost}
				/>
			</div>
		);
	}
}
