import gql from "graphql-tag";
import React from "react";
import { Query, QueryResult } from "react-apollo";
import MealSummary from "../components/MealSummary";
import Meal from "../entities/Meal";

const MEAL = gql`
	query Meal($mealID: Int!) {
		meal(id: $mealID) {
			id
			title
			description
			price
			startTime
			endTime
			maxGuests
			city
			host {
				id
				name
				about
				imagePath
				whitelist {
					id
					name
				}
			}
			guests {
				id
				name
			}
			recipes {
				id
				tags {
					id
					name
				}
				allergies {
					id
					name
				}
			}
		}
	}
`;

interface IMealData {
	meal: Partial<Meal>;
}

interface IMealVariables {
	mealID: number;
}

type MealResult = QueryResult<IMealData, IMealVariables>;

interface IMealSummaryContainerProps {
	showHost?: boolean;
	mealID: number;
}

export default class MealSummaryContainer extends React.Component<IMealSummaryContainerProps> {
	public render(): JSX.Element {
		return (
			<Query query={MEAL} variables={{ mealID: this.props.mealID }}>
				{(result: MealResult) => {
					if (result.loading) { return <div></div>; }
					if (result.error) {
						console.error(result.error);
						return <div>{result.error.message}</div>;
					}

					return (
						<div className="card">
							<MealSummary
								id={result.data!.meal.id!}
								city={result.data!.meal.city!}
								imagePath={result.data!.meal.imagePath}
								title={result.data!.meal.title!}
								description={result.data!.meal.description!}
								host={result.data!.meal.host!}
								startTime={result.data!.meal.startTime!}
								endTime={result.data!.meal.endTime!}
								guests={result.data!.meal.guests || []}
								maxGuests={result.data!.meal.maxGuests || 0}
								price={result.data!.meal.price || 0}
								recipes={result.data!.meal.recipes || []}
								showHost={this.props.showHost}
							/>
						</div>
					);
				}}
			</Query>
		);
	}
}
