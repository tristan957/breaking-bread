// Meal article is like the dashboard feed. Consists of image, title, tags, desc., recipes.
import React from "react";
import "./resources/css/MealActions.css";

enum MealStatus {
	unApplied, applied, accepted, rejected, pending,
}

interface IMealActionsState {
	mealStatus: MealStatus;
}

export default class MealActions extends React.Component<any, IMealActionsState> {
	constructor(props: any) {
		super(props);
	}

	public componentWillMount(): void {
		this.setState({ mealStatus: MealStatus.unApplied });
	}

	public renderStatus(): string {
		switch (this.state.mealStatus) {
			case MealStatus.unApplied: {
				return "not applied";
			}
			case MealStatus.applied: {
				return "applied";
			}
			case MealStatus.rejected: {
				return "rejected";
			}
			case MealStatus.pending: {
				return "pending";
			}
			case MealStatus.accepted: {
				return "accepted";
			}
			default: {
				return "";
			}
		}
	}

	public renderButton(): JSX.Element {
		switch (this.state.mealStatus) {
			case MealStatus.unApplied: {
				return <button id="actionButton">apply</button>;
			}
			case MealStatus.rejected: {
				return <button id="actionButton">apply</button>;
			}
			default: {
				return <button id="actionButton">cancel</button>;
			}
		}
	}

	public render(): JSX.Element {
		return (
			// TODO: Edit link to editMealPage if current user is the meal host
			<div className="card cardSubstance" id="mealActions">
				<div><h5>status: {this.renderStatus()}</h5></div>
				{this.renderButton()}
			</div>
		);
	}
}
