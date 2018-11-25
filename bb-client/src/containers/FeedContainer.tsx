// tslint:disable: no-unsafe-any no-any
import { gql } from "apollo-boost";
import moment from "moment";
import React from "react";
import { Query, QueryResult } from "react-apollo";
import { SingleDatePicker } from "react-dates";
import "react-dates/initialize";
import { Button, Col, Form, FormGroup, Input, Label } from "reactstrap";
import Rodal from "rodal";
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
	createdAt: moment.Moment | null;
	calendarFocused: boolean;
	visible: boolean;
}

export default class FeedContainer extends React.Component<{}, IFeedContainerState> {
	constructor(props: Readonly<{}>) {
		super(props);

		this.state = {
			createdAt: moment(),
			calendarFocused: false,
			visible: false,
		};
	}

	public showModal = (): void => {
		this.setState({
			visible: true,
		});
	}

	public hideModal = (): void => {
		this.setState({
			visible: false,
		});
	}

	public onDateChange = (date: moment.Moment | null): void => {
		this.setState({
			createdAt: date,
		});
	}

	public onFocusChange = (): void => {
		this.setState({
			calendarFocused: !this.state.calendarFocused,
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
								<Button type="submit" onClick={this.showModal} id="show-filter-modal">Filter</Button>
							</div>

							<Rodal visible={this.state.visible} onClose={this.hideModal}>
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

										<Button className="float-right">Submit</Button>
									</Form>
								</div>
							</Rodal>
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
