import moment from "moment";
import React from "react";
import { SingleDatePicker } from "react-dates";
import "react-dates/initialize";
import { Button, Col, Form, FormGroup, Input, Label } from "reactstrap";
import Rodal from "rodal";
import Meal from "../../entities/Meal";
import User from "../../entities/User";
import AutoCompletionSearchBar from "../AutoSuggestion";
import MealSummaryCard from "../cards/MealSummaryCard";
import "../resources/css/Feed.css";

interface IFeedContainerState {
	loadedMeals: Partial<Meal>[];
	createdAt: moment.Moment | null;
	calendarFocused: boolean;
	visible: boolean;
}

export default class FeedContainer extends React.Component<{}, IFeedContainerState> {
	constructor(props: Readonly<{}>) {
		super(props);

		this.state = {
			loadedMeals: [],
			createdAt: moment(),
			calendarFocused: false,
			visible: false,
		};
	}

	public showModal(): void {
		this.setState({
			visible: true,
		});
	}

	public hideModal(): void {
		this.setState({
			visible: false,
		});
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
					maxGuests: 3,
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
					maxGuests: 4,
				},
			],
		});
	}

	public render(): JSX.Element {
		return (
			<div>
				<span id="feedTitle">Feed</span>
				<Button type="submit" onClick={this.showModal.bind(this)} id="filter">Filters</Button>

				<Rodal visible={this.state.visible} onClose={this.hideModal.bind(this)}>
					<div className="header">Filters</div>
					<div className="body">
						<Form>
							<FormGroup row>
								<Label for="search" sm={2}>Search</Label>
								<Col sm={10}>
									<AutoCompletionSearchBar />
								</Col>
							</FormGroup>

							<FormGroup row>
								<Label for="guest" sm={2}>Guest</Label>
								<Col sm={10}>
									<Input type="select" name="guest" id="guest">
										<option value="Guests" disabled>Guests</option>
										<option>1</option>
										<option>2</option>
										<option>3</option>
										<option>4</option>
										<option>5</option>
									</Input>
								</Col>
							</FormGroup>

							<FormGroup row>
								<Label for="date" sm={2}>Date</Label>
								<Col sm={10}>
									<SingleDatePicker
										date={this.state.createdAt}
										focused={this.state.calendarFocused}
										onDateChange={this.onDateChange}
										onFocusChange={this.onFocusChange}
										id={"datepicker"}
										small={true}
										numberOfMonths={1}
									/>
								</Col>
							</FormGroup>

							<Button className="float-right"> Submit </Button>
						</Form>
					</div>
				</Rodal>
				<ul>
					{
						this.state.loadedMeals.map((meal, i) => {
							return (
								<li key={i} className="feedCard">
									<MealSummaryCard
										id={meal.id as number}  // TODO: Reconsider all casts considering this is a partial meal
										location={meal.location || ""}
										host={meal.host as User}
										imagePath={meal.imagePath}
										title={meal.title || ""}
										description={meal.description || ""}
										date={meal.date as Date}
										guests={meal.guests || []}
										maxGuests={meal.maxGuests as number}
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
