import gql from "graphql-tag";
import React from "react";
import { Query, QueryResult } from "react-apollo";
import UpcomingMeals from "../components/UpcomingMeals";
import User from "../entities/User";
import "./resources/css/UpcomingMealsContainer.css";

interface IUpcomingMealsContainerProps {
	userID: number;
}

const USER_UPCOMING_MEALS = gql`
	query UserUpcomingMeals($id: Int!) {
		user(id: $id) {
			id
			upcomingMeals {
				id
				title
				price
				startTime
				endTime
				guests {
					id
					firstName
					lastName
					imagePath
				}
				maxGuests
				location
			}
		}
	}
`;

interface IUserUpcomingMealsData {
	user: Partial<User>;
}

interface IUserUpcomingMealsVariables {
	id: number;
}

type UserUpcomingMealsResult = QueryResult<IUserUpcomingMealsData, IUserUpcomingMealsVariables>;

export default class UpcomingMealsContainer extends React.Component<IUpcomingMealsContainerProps> {
	public render(): JSX.Element {
		return (
			<Query query={USER_UPCOMING_MEALS} variables={{ id: this.props.userID }}>
				{(result: UserUpcomingMealsResult) => {
					if (result.loading) { return <div></div>; }
					if (result.error) {
						console.error(result.error);
						return <div>{result.error.message}</div>;
					}

					return (
						<div className="card">
							<div className="container-header">Your Upcoming Meals</div>
							<hr className="separator" />
							<UpcomingMeals upcomingMeals={result.data!.user.upcomingMeals || []} />
						</div>
					);
				}}
			</Query>
		);
	}
}
