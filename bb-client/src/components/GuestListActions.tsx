// Meal article is like the dashboard feed. Consists of image, title, tags, desc., recipes.
import React from "react";
import "./resources/css/MealActions.css";

enum MealStatus {
	notApplicable, unApplied, applied, accepted, rejected, pending,
}

interface IMealActionsProps {
	isGuest: boolean;
}

interface IMealActionsState {
	mealStatus: MealStatus;
}

export default class GuestListActions extends React.Component<IMealActionsProps, IMealActionsState> {
	constructor(props: IMealActionsProps) {
		super(props);

		this.apply = this.apply.bind(this);
		this.cancel = this.cancel.bind(this);
	}

	public componentWillMount(): void {
		this.setState({
			mealStatus: MealStatus.unApplied,
		});
	}


	public renderHostAction(): JSX.Element {
		return (
			<div className="card cardSubstance mealActions">
				<button className="actionButton">delete guest</button>
			</div>
		);
	}

	public renderGuestAction(): JSX.Element {
		return (
			<div className="card cardSubstance mealActions">
				<div><h5>status: {this.renderStatus()}</h5></div>
				{this.renderButton()}
			</div>
		);
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

	public apply(): void {
		this.setState({ mealStatus: MealStatus.applied });
	}

	public cancel(): void {
		this.setState({ mealStatus: MealStatus.unApplied });
	}

	public renderButton(): JSX.Element {
		switch (this.state.mealStatus) {
			case MealStatus.unApplied: {
				return <button className="actionButton" onClick={this.apply}>apply</button>;
			}
			case MealStatus.rejected: {
				return <button className="actionButton" onClick={this.apply}>apply</button>;
			}
			default: {
				return <button className="actionButton" onClick={this.cancel}>cancel</button>;
			}
		}
	}

	public render(): JSX.Element {
		if (this.props.isGuest) {
			return this.renderGuestAction();
		}
		return this.renderHostAction();
	}
}
