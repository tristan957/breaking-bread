// Meal article is like the dashboard feed. Consists of image, title, tags, desc., recipes.
import moment from "moment";
import React from "react";
import { SingleDatePicker } from "react-dates";
import Rodal from "rodal";
import Meal from "../entities/Meal";
import "./resources/css/MealActions.css";

enum Identity {
	guest, host,
}

enum MealStatus {
	notApplicable, unApplied, applied, accepted, rejected, pending,
}

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

interface IMealActionsState {
	identity: Identity;
	mealStatus: MealStatus;
	deletionModalVisible: boolean;
	editModalVisible: boolean;
	mealTitle: string | undefined;
	mealDate: Date | undefined;
	mealLocation: string | undefined;
	mealDescription: string | undefined;
	createdAt: moment.Moment | null;
	calendarFocused: boolean;
	mealTime: string;
	testText: string;
}

export default class MealActions extends React.Component<IMealActionsProps, IMealActionsState> {
	constructor(props: IMealActionsProps) {
		super(props);

		this.showDeletionModal = this.showDeletionModal.bind(this);
		this.hideDeletionModal = this.hideDeletionModal.bind(this);
		this.showEditModal = this.showEditModal.bind(this);
		this.hideEditModal = this.hideEditModal.bind(this);
	}

	public componentWillMount(): void {
		this.setState({
			identity: Identity.host,
			mealStatus: MealStatus.notApplicable,
			deletionModalVisible: false,
			editModalVisible: false,
			mealTitle: this.props.meal.title,
			mealDate: this.props.meal.date,
			mealLocation: this.props.meal.location,
			mealDescription: this.props.meal.description,
			testText: "xxy",
		});
	}

	public showDeletionModal(): void {
		this.setState({
			deletionModalVisible: true,
		});
	}

	public hideDeletionModal(): void {
		this.setState({
			deletionModalVisible: false,
		});
	}

	public showEditModal(): void {
		this.setState({
			editModalVisible: true,
		});
	}

	public hideEditModal(): void {
		this.setState({
			editModalVisible: false,
		});
	}

	public handleTitleChange(event: any): void {
		this.setState({ mealTitle: event.target.value });
	}

	public handleLocationChange(event: any): void {
		this.setState({ mealDate: event.target.value });
	}

	public handleDescriptionChange(event: any): void {
		this.setState({ mealDescription: event.target.value });
	}

	public onDateChange(date: moment.Moment | null): void {
		this.setState({
			createdAt: date,
		});
	}

	public onFocusChange(): void {
		this.setState({
			calendarFocused: !this.state.calendarFocused,
		});
	}

	public handleTimeChange(event: any): void {
		this.setState({
			mealTime: event.target.value
		});
	}

	public modifyMeal(): void {
		this.setState({ testText: "zzz" });

		this.props.setMeal(
			this.state.mealDate,
			this.state.mealTitle,
			this.state.mealLocation,
			this.state.mealDescription,
			this.state.mealTime
		);

		this.hideEditModal();
	}

	public renderHostAction(): JSX.Element {
		return (
			<div className="card cardSubstance mealActions">
				<button className="actionButton" onClick={this.showEditModal}>edit</button>
				<button className="actionButton" onClick={this.showDeletionModal}>delete</button>
				<span>{this.state.testText}</span>

				<Rodal visible={this.state.deletionModalVisible} onClose={this.hideDeletionModal}>
					<div>are you sure?</div>
					<div>
						{/* TODO: delete functionaity */}
						<button>yes</button>
						<button type="submit" onClick={this.hideDeletionModal}>no</button>
					</div>
				</Rodal>

				<Rodal visible={this.state.editModalVisible} onClose={this.hideEditModal}>
					{/* <form onSubmit={this.modifyMeal.bind(this)}> */}
					<div>
						<span>Date: </span>
						<SingleDatePicker
							date={moment(this.state.mealDate)}
							focused={this.state.calendarFocused}
							onDateChange={this.onDateChange.bind(this)}
							onFocusChange={this.onFocusChange.bind(this)}
							id={"datepicker"}
							small={true}
							numberOfMonths={1}
						/>
						<label>
							Time:
							<input type="text" value={this.state.mealTime} onChange={e => this.handleTimeChange(e)} />
						</label>
					</div>
					<label>
						Title:
						<input type="text" value={this.state.mealTitle} onChange={e => this.handleTitleChange(e)} />
					</label>
					<label>
						Location:
						<input type="text" value={this.state.mealLocation} onChange={e => this.handleLocationChange(e)} />
					</label>
					<label>
						Description:
						<textarea value={this.state.mealDescription} onChange={e => this.handleDescriptionChange(e)} />
					</label>
					<button onClick={this.modifyMeal.bind(this)}>submit</button>
					{/* <input type="submit" value="Submit" /> */}
					{/* </form> */}
				</Rodal>
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

	public renderButton(): JSX.Element {
		switch (this.state.mealStatus) {
			case MealStatus.unApplied: {
				return <button className="actionButton">apply</button>;
			}
			case MealStatus.rejected: {
				return <button className="actionButton">apply</button>;
			}
			default: {
				return <button className="actionButton">cancel</button>;
			}
		}
	}

	public render(): JSX.Element {
		if (this.state.identity == Identity.host) {
			return this.renderHostAction();
		}
		return this.renderGuestAction();
	}
}
