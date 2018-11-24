// tslint:disable: no-unsafe-any no-any
import moment from "moment";
import React from "react";
import { SingleDatePicker } from "react-dates";
import { Button } from "reactstrap";
import Rodal from "rodal";
import Meal from "../entities/Meal";
import "./resources/css/MealModification.css";

interface IMealModificationProps {
	meal: Partial<Meal>;
	setMeal: ((
		startTime?: Date,
		endTime?: Date,
		title?: string,
		location?: string,
		description?: string
	) => void);
}

interface IMealModificationState {
	deletionModalVisible: boolean;
	editModalVisible: boolean;
	mealTitle?: string;
	mealStartTime?: Date;
	mealEndTime?: Date;
	mealLocation?: string;
	mealDescription?: string;
	createdAt?: moment.Moment;
	calendarFocused: boolean;
	mealTime: string;
	testText: string;
}

export default class MealModification extends React.Component<IMealModificationProps, IMealModificationState> {
	public componentWillMount(): void {
		this.setState({
			deletionModalVisible: false,
			editModalVisible: false,
			mealTitle: this.props.meal.title,
			mealStartTime: this.props.meal.startTime,
			mealLocation: this.props.meal.location,
			mealDescription: this.props.meal.description,
			testText: "xxy",
		});
	}

	public showDeletionModal = (): void => {
		this.setState({
			deletionModalVisible: true,
		});
	}

	public hideDeletionModal = (): void => {
		this.setState({
			deletionModalVisible: false,
		});
	}

	public showEditModal = (): void => {
		this.setState({
			editModalVisible: true,
		});
	}

	public hideEditModal = (): void => {
		this.setState({
			editModalVisible: false,
		});
	}

	public handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
		this.setState({ mealTitle: event.target.value });
	}

	public handleLocationChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
		this.setState({ mealLocation: event.target.value });
	}

	public handleDescriptionChange = (event: React.ChangeEvent<HTMLTextAreaElement>): void => {
		this.setState({ mealDescription: event.target.value });
	}

	public onDateChange = (date: moment.Moment | undefined): void => {
		this.setState({
			createdAt: date,
		});
	}

	public onFocusChange = (): void => {
		this.setState({
			calendarFocused: !this.state.calendarFocused,
		});
	}

	public handleTimeChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
		this.setState({
			mealTime: event.target.value,
		});
	}

	public modifyMeal = (): void => {
		this.setState({ testText: "zzz" });

		this.props.setMeal(
			this.state.mealStartTime,
			this.state.mealEndTime,
			this.state.mealTitle,
			this.state.mealLocation,
			this.state.mealDescription
		);

		this.hideEditModal();
	}

	public render(): JSX.Element {
		return (
			/* Removed card cardSubstance MealModification from className */
			<div>
				<div id="meal-buttons">
					<Button className="actionButton edit-meal" onClick={this.showEditModal}>Edit Meal</Button>
					<Button className="actionButton delete-meal" onClick={this.showDeletionModal}>Delete Meal</Button>
				</div>

				{/* <span>{this.state.testText}</span> */}

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
							date={moment(this.state.mealStartTime)}
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
}
