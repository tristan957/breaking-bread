// tslint:disable: no-unsafe-any no-any
import { gql } from "apollo-boost";
import moment from "moment";
import React from "react";
import { Query, QueryResult } from "react-apollo";
import { DateRangePicker } from "react-dates";
import "react-dates/initialize";
import Geosuggest from "react-geosuggest";
import { Button, Col, Form, FormGroup, Input, InputGroup, Label, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import AutoCompletionSearchBar from "../components/AutoCompletionSearchBar";
import Meal from "../entities/Meal";
import Tag from "../entities/Tag";
import Topic from "../entities/Topic";
import MealSummariesContainer from "./MealSummariesContainer";
import "./resources/css/FeedContainer.css";

const GET_MEAL_FEED = gql`
	query GetMealFeed($options: GetMealFeedOptions, $first: Int!, $after: String) {
		getMealFeed(filterOptions: $options, first: $first, after: $after) {
			edges {
				cursor
				node {
					id
					title
					startTime
					endTime
					location
					price
					recipes {
						tags {
							id
							name
						}
					}
					host {
						id
						firstName
						lastName
						about
						imagePath
					}
					guests {
						id
						firstName
						lastName
					}
					maxGuests
				}
			}
			pageInfo {
				endCursor
				hasNextPage
			}
			totalCount
		}
	}
`;

interface IGetMealFeedOptions {
	location?: {
		distanceMI: number;
		fromLocation: string; // Either an address or a lat and lon
	};
	dateSpan?: {
		from: number;
		to: number;
	};
	maxGuests?: number;
	tags?: Partial<Tag>;
	topics?: Partial<Topic>;
}

interface IEdge {
	cursor: string;
	node: Partial<Meal>;
}

interface IPageInfo {
	endCursor: string;
	hasNextPage: boolean;
}

interface IGetMealFeedResult {
	getMealFeed: {
		edges: IEdge[];
		pageInfo: IPageInfo;
		totalCount: number;
	};
}

interface IFeedContainerState {
	startDate: moment.Moment | null;
	endDate: moment.Moment | null;
	focusedInput: "startDate" | "endDate" | null;
	modal: boolean;
}

export default class FeedContainer extends React.Component<{}, IFeedContainerState> {
	// tslint:disable-next-line:variable-name
	constructor(props: Readonly<{}>) {
		super(props);
		this.onDateChange = this.onDateChange.bind(this);
		this.onFocusChange = this.onFocusChange.bind(this);
		this.toggleModal = this.toggleModal.bind(this);
		this.state = {
			startDate: moment(),
			endDate: moment(),
			focusedInput: null,
			modal: false,
		};
	}

	public toggleModal(): void {
		this.setState({
			modal: !this.state.modal,
		});
	}

	public onDateChange(arg: { startDate: moment.Moment | null; endDate: moment.Moment | null }): void {
		this.setState({
			startDate: arg.startDate,
			endDate: arg.endDate,
		});
	}

	public onFocusChange(focusedInput: "startDate" | "endDate" | null): void {
		this.setState({
			focusedInput,
		});
	}

	public render(): JSX.Element {
		const options: IGetMealFeedOptions = {}; // TODO: Load options some other way
		const first = 2;

		return (
			<Query
				query={GET_MEAL_FEED}
				variables={{
					options,
					first,
				}}
			>
				{(result: QueryResult<IGetMealFeedResult>) => {
					if (result.loading) {
						return <div></div>;
					}
					if (result.error) {
						return (
							<div>
								{`Error! Something terrible has happened! ${result.error.message}`}
							</div>
						);
					}

					let consumedCursor = false;
					const feedMeals: Partial<Meal>[] = result.data!.getMealFeed.edges.map(edge => edge.node);
					return (
						<div id="feed-container">
							<div id="feed-header">
								<span id="feed-title">Feed</span>
								<Button type="submit" onClick={this.toggleModal} id="show-filter-modal">Filter</Button>
							</div>

							<Modal centered={true} isOpen={this.state.modal} toggle={this.toggleModal} className={"feed-container-modal"}>
								<ModalHeader toggle={this.toggleModal}>Search Filters</ModalHeader>
								<ModalBody>
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
												<InputGroup className={"guest"}>
													<Input placeholder="# of Guests" type="number" step="1" />
												</InputGroup>
											</Col>
										</FormGroup>
										<FormGroup row>
											<Label for="location" sm={2}>Location</Label>
											<Col sm={10}>
												<Geosuggest
													placeholder={"Start typing!"}
													initialValue="Texas A&M"
													location={new google.maps.LatLng(40.741895, -73.989308)}
													radius={20} />
											</Col>
										</FormGroup>
										<FormGroup row>
											<Label for="date" sm={2}>Date</Label>
											<Col sm={10}>
												<DateRangePicker
													startDateId={"sdid"}
													endDateId={"edid"}
													startDate={this.state.startDate}
													endDate={this.state.endDate}
													onDatesChange={this.onDateChange}
													focusedInput={this.state.focusedInput}
													onFocusChange={this.onFocusChange}
													startDatePlaceholderText={"Start Date"}
													endDatePlaceholderText={"End Date"}
													small={true}
													numberOfMonths={1}
												/>
											</Col>
										</FormGroup>
									</Form>
								</ModalBody>
								<ModalFooter>
									<Button className="float-right">Submit</Button>
								</ModalFooter>
							</Modal>
							<MealSummariesContainer
								onLoadMore={() => {
									if (result.data!.getMealFeed.pageInfo.hasNextPage && !consumedCursor) {
										consumedCursor = true;

										result.fetchMore({
											variables: {
												options,
												first,
												after: result.data!.getMealFeed.pageInfo.endCursor,
											},
											updateQuery: (prev: IGetMealFeedResult, { fetchMoreResult }): IGetMealFeedResult => {
												if (!fetchMoreResult) { return prev; }

												consumedCursor = false;
												return {
													...prev,
													getMealFeed: {
														...prev.getMealFeed,
														...fetchMoreResult.getMealFeed,
														edges: [...prev.getMealFeed.edges, ...fetchMoreResult.getMealFeed.edges],
													},
												};
											},
										});
									}
								}}
								meals={feedMeals}
								showHosts={true}
							/>
						</div>
					);
				}}
			</Query>
		);
	}
}
