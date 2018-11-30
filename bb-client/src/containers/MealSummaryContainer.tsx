import React from "react";
import MealSummary from "../components/MealSummary";
import Meal from "../entities/Meal";

interface IMealSummaryContainerProps {
	showHost?: boolean;
	meal: Partial<Meal>;
}

export default class MealSummaryContainer extends React.Component<IMealSummaryContainerProps> {
	public render(): JSX.Element {
		return (
			<div className="card">
				<MealSummary
					id={this.props.meal.id!}
					city={this.props.meal.city!}
					imagePath={this.props.meal.imagePath}
					title={this.props.meal.title!}
					description={this.props.meal.description!}
					host={this.props.meal.host!}
					startTime={this.props.meal.startTime!}
					endTime={this.props.meal.endTime!}
					guests={this.props.meal.guests || []}
					maxGuests={this.props.meal.maxGuests || 0}
					price={this.props.meal.price || 0}
					recipes={this.props.meal.recipes || []}
					showHost={this.props.showHost}
				/>
			</div>
		);
	}
}
