import React from "react";
import MealActions from "../components/MealActions";
import Meal from "../entities/Meal";

interface IMealActionsProps {
	meal: Partial<Meal>;
	setMeal: (
		date: Date | undefined,
		title: string | undefined,
		location: string | undefined,
		description: string | undefined,
		time: string
	) => void;
}

export default class MealActionsContainer extends React.Component<IMealActionsProps> {
	constructor(props: IMealActionsProps) {
		super(props);
	}

	public render(): JSX.Element {
		return (
			<div>
				<MealActions meal={this.props.meal} setMeal={this.props.setMeal} />
			</div>
		);
	}
}
