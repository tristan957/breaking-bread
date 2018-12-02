import gql from "graphql-tag";
import React from "react";
import { Query, QueryResult } from "react-apollo";
import User from "../entities/User";
import MealSummariesContainer from "./MealSummariesContainer";

const USER_HOSTED_MEALS = gql`
	query UserHostedMeals($userID: Int!) {
		user(id: $userID) {
			id
			hostedMeals {
				id
				title
				city
				imagePath
				description
				host {
					id
					imagePath
					name
				}
				startTime
				endTime
				guestCount
				maxGuests
				price
			}
		}
	}
`;

interface IHostedMealsData {
	user: Partial<User>;
}

interface IHostedMealsVariables {
	userID: number;
}

type HostedMealsResult = QueryResult<IHostedMealsData, IHostedMealsVariables>;

interface IHostedMealsContainerProps {
	userID: number;
}

export default class HostedMealsContainer extends React.Component<IHostedMealsContainerProps> {
	public render(): JSX.Element {
		return (
			<Query query={USER_HOSTED_MEALS} variables={{ userID: this.props.userID }}>
				{(result: HostedMealsResult) => {
					if (result.loading) { return <div></div>; }
					if (result.error) {
						console.log(result.error);
						return <div>{result.error.message}</div>;
					}

					return <MealSummariesContainer meals={result.data!.user.hostedMeals || []} />;
				}}
			</Query>
		);
	}
}
