import ApolloClient from "apollo-client";
import gql from "graphql-tag";
import React from "react";
import { ApolloConsumer, FetchResult } from "react-apollo";
import NewUser, { INewUserDetails } from "../components/NewUser";

const USER_SAVE = gql`
	mutation UserSave ($input: UserSaveInput!) {
		userSave(input: $input) {
			id
		}
	}
`;

interface IUserSaveInput {
	input: {
		firstName: string;
		lastName: string;
		imagePath?: string;
		about?: string;
		location: {
			streetAddress: string;
			lat: number;
			long: number;
		};
		email: string;
		phoneNumber: string;
		oAuthSub: string;
	};
}

interface IUserSaveResult {
	userSave: {
		id: number | null;
	};
}

type UserSaveResult = FetchResult<IUserSaveResult>;

interface IRetreivedProfileInfo {
	email?: string;
	emailVerified?: boolean;
	lastName?: string;
	firstName?: string;
	picture?: string;
	userSub?: string;
	onValidSet?: Function;
	reloadUser: Function;
}

export default class NewUserContainer extends React.Component<IRetreivedProfileInfo> {
	constructor(props: IRetreivedProfileInfo) {
		super(props);
	}

	public submitNewUser = (client: ApolloClient<any>, newUserDetails: INewUserDetails) => {
		const variables: IUserSaveInput = {
			input: {
				lastName: newUserDetails.lastName!,
				firstName: newUserDetails.firstName!,
				imagePath: this.props.picture,
				about: newUserDetails.description,
				location: {
					streetAddress: newUserDetails.location!.label,
					lat: parseFloat(newUserDetails.location!.location.lat),
					long: parseFloat(newUserDetails.location!.location.lng),
				},
				email: newUserDetails.email!,
				phoneNumber: newUserDetails.phoneNumber!,
				oAuthSub: this.props.userSub!,
			},
		};

		client.mutate<IUserSaveResult>({
			mutation: USER_SAVE,
			variables,
		}).then((result: UserSaveResult) => {
			if (this.props.onValidSet === undefined || result.data === undefined) {
				return console.log("Issue with mutation");
			}
			if (result.data.userSave.id === null) {
				return console.log("Issue with user creation on the server.");
			}

			this.props.onValidSet();
			this.props.reloadUser();
		}).catch((err: Error) => {
			console.log(err);
		});
	}

	public renderNewUser = (client: ApolloClient<any>): JSX.Element => {
		if (this.props.firstName !== undefined) {
			return (
				<NewUser
					email={this.props.email!}
					emailVerified={this.props.emailVerified!}
					lastName={this.props.lastName!}
					firstName={this.props.firstName}
					picture={this.props.picture!}
					validSubmit={(newUserDetails: INewUserDetails) => this.submitNewUser(client, newUserDetails)}
				/>
			);
		} else {
			return (
				<div></div>
			);
		}
	}

	public render(): JSX.Element {
		return (
			<ApolloConsumer>
				{client => {
					return (
						<div>
							{this.renderNewUser(client)}
						</div>
					);
				}}
			</ApolloConsumer>
		);
	}
}
