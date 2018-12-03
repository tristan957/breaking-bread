// tslint:disable: no-unsafe-any no-any
import moment from "moment";
import React from "react";
import { SingleDatePicker } from "react-dates";
import { Button, Modal, ModalFooter, ModalHeader } from "reactstrap";
import ModalBody from "reactstrap/lib/ModalBody";
import Meal from "../entities/Meal";
import "./resources/css/MealModification.css";

interface IMealModificationProps {
	meal: Partial<Meal>;
}

interface IMealModificationState {
	deletionModalVisible: boolean;
	editModalVisible: boolean;
	mealTitle?: string;
	mealStartTime?: string;
	mealEndTime?: string;
	mealCity?: string;
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
			mealCity: this.props.meal.city,
			mealDescription: this.props.meal.description,
			testText: "xxy",
		});
	}

	public toggleDeletionModal = (): void => {
		this.setState({
			deletionModalVisible: !this.state.deletionModalVisible,
		});
	}

	public toggleEditModal = (): void => {
		this.setState({
			editModalVisible: !this.state.editModalVisible,
		});
	}

	public handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
		this.setState({ mealTitle: event.target.value });
	}

	public handleLocationChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
		this.setState({ mealCity: event.target.value });
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
		this.toggleEditModal();
	}

	public render(): JSX.Element {
		return (
			/* Removed card cardSubstance MealModification from className */
			<div>
				<div id="meal-buttons">
					<Button className="actionButton edit-meal" onClick={this.toggleEditModal}>Edit Meal</Button>
					<Button className="actionButton delete-meal" onClick={this.toggleDeletionModal}>Delete Meal</Button>
				</div>

				{/* <span>{this.state.testText}</span> */}

				<Modal centered={true} isOpen={this.state.deletionModalVisible} toggle={this.toggleDeletionModal}>
					<ModalHeader>
						Delete Meal
					</ModalHeader>
					<ModalBody>
						<div>Are you sure you wish to delete this meal?</div>
					</ModalBody>
					<ModalFooter>
						{/* TODO: delete functionaity */}
						<button>Yes</button>
						<button type="submit" onClick={this.toggleDeletionModal}>No</button>
					</ModalFooter>
				</Modal>

				<Modal centered={true} isOpen={this.state.editModalVisible} toggle={this.toggleEditModal}>
					{/* <form onSubmit={this.modifyMeal.bind(this)}> */}
					<ModalHeader>
						Edit Meal
					</ModalHeader>
					<ModalBody>
						<div>
							<span>Date</span>
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
								Time
							<input type="text" value={this.state.mealTime} onChange={e => this.handleTimeChange(e)} />
							</label>
						</div>
						<label>
							Title
						<input type="text" value={this.state.mealTitle} onChange={e => this.handleTitleChange(e)} />
						</label>
						<label>
							Location
						<input type="text" value={this.state.mealCity} onChange={e => this.handleLocationChange(e)} />
						</label>
						<label>
							Description
						<textarea value={this.state.mealDescription} onChange={e => this.handleDescriptionChange(e)} />
						</label>
					</ModalBody>
					<ModalFooter>
						<button onClick={this.modifyMeal.bind(this)}>submit</button>
					</ModalFooter>
				</Modal>
			</div>
		);
	}
}
