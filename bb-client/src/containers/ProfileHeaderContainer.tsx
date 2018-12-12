import gql from "graphql-tag";
import React from "react";
import { Mutation, MutationFn, MutationResult, Query, QueryResult } from "react-apollo";
import { Suggest } from "react-geosuggest";
import { Button, Col, Form, FormGroup, Input, Label, Modal, ModalBody, ModalHeader } from "reactstrap";
import GeoSuggest from "../components/GeoSuggest";
import LargeProfileSummary from "../components/LargeProfileSummary";
import User from "../entities/User";
import "./resources/css/ProfileHeaderContainer.css";

const USER_PROFILE = gql`
	query UserProfile($id: Int!) {
		user(id: $id) {
			id
			firstName
			lastName
			name
			about
			imagePath
			reviewAverage
			numberOfFollowers
			createdAt
			phoneNumber
			email
		}
	}
`;

interface IUserProfileData {
	user?: Partial<User>;
}

interface IUserProfileVariables {
	id: number;
}

type UserProfileResult = QueryResult<IUserProfileData, IUserProfileVariables>;

const USER_EDIT = gql`
	mutation UserEdit($input: UserEditInput!) {
		userEdit(input: $input) {
			id
		}
	}
`;

interface IUserEditData {
	userEdit: Partial<User>;
}

interface ILocation {
	streetAddress: string;
	lat: number;
	long: number;
}

interface IUserEditVariables {
	input: Partial<User> & { location?: ILocation };
}

type UserEditResult = MutationResult<IUserEditData>;
type UserEditFn = MutationFn<IUserEditData, IUserEditVariables>;

interface IProfileHeaderProps {
	userID: number;
	viewerID?: number;
}

interface IProfileHeaderState {
	firstName?: string;
	lastName?: string;
	about?: string;
	imagePath?: string;
	location?: ILocation;
	email?: string;
	phoneNumber?: string;
	modalOpen: boolean;
}

export default class ProfileHeaderContainer extends React.Component<IProfileHeaderProps, IProfileHeaderState> {
	constructor(props: IProfileHeaderProps) {
		super(props);

		this.state = { modalOpen: false };
	}

	private toggle = (e: React.MouseEvent<HTMLButtonElement>): void => {
		this.setState({ ...this.state, modalOpen: !this.state.modalOpen });
	}

	public render(): JSX.Element {
		return (
			<Query query={USER_PROFILE} variables={{ id: this.props.userID }}>
				{(result: UserProfileResult) => {
					if (result.loading) { return <div></div>; }
					if (result.error) {
						console.error(result.error);
						return <div>{result.error.message}</div>;
					}

					return (
						<div id="profile-header-container" className="card">
							<div id="profile-header-left-container">
								<LargeProfileSummary
									userID={result.data!.user!.id!}
									viewerID={this.props.viewerID}
									name={result.data!.user!.name!}
									imagePath={result.data!.user!.imagePath}
									reviewAverage={result.data!.user!.reviewAverage}
									numberOfFollowers={result.data!.user!.numberOfFollowers}
								/>
								{result.data!.user!.id! === this.props.viewerID
									? (
										<Mutation mutation={USER_EDIT}>
											{(userEdit: UserEditFn, mResult: UserEditResult) => {
												if (mResult.error) {
													console.error(mResult.error);
													return <div>{mResult.error}</div>;
												}

												const firstColSize = 3;
												const secondColSize = 12 - firstColSize;

												return (
													<div id="edit-profile-button">
														<Button onClick={this.toggle}>Edit Profile</Button>
														<Modal isOpen={this.state.modalOpen}>
															<ModalHeader>Edit Profile</ModalHeader>
															<ModalBody>
																<Form onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
																	// the following may not work
																	const input: Partial<User> & { location?: ILocation } = {
																		id: this.props.userID,
																		firstName: this.state.firstName,
																		lastName: this.state.lastName,
																		about: this.state.about,
																		phoneNumber: this.state.phoneNumber,
																		email: this.state.email,
																		imagePath: this.state.imagePath,
																		location: this.state.location,
																	};

																	userEdit({ variables: { input: { ...input } } });
																	this.setState({ ...this.state, modalOpen: !this.state.modalOpen });
																	e.preventDefault();
																}}>
																	<FormGroup row>
																		<Label for="firstName" sm={firstColSize}>First Name</Label>
																		<Col sm={secondColSize}>
																			<Input type="text" name="firstNameInput" defaultValue={result.data!.user!.firstName} onChange={(e: React.ChangeEvent<HTMLInputElement>) => this.setState({ ...this.state, firstName: e.target.value })} />
																		</Col>
																	</FormGroup>
																	<FormGroup row>
																		<Label for="lastName" sm={firstColSize} required>Last Name</Label>
																		<Col sm={secondColSize}>
																			<Input type="text" name="lastNameInput" defaultValue={result.data!.user!.lastName} onChange={(e: React.ChangeEvent<HTMLInputElement>) => this.setState({ ...this.state, lastName: e.target.value })} />
																		</Col>
																	</FormGroup>
																	<FormGroup row required>
																		<Label for="phone" sm={firstColSize} required>Phone</Label>
																		<Col sm={9}>
																			<Input type="tel" name="phoneInput" defaultValue={result.data!.user!.phoneNumber} onChange={(e: React.ChangeEvent<HTMLInputElement>) => this.setState({ ...this.state, phoneNumber: e.target.value })} />
																		</Col>
																	</FormGroup>
																	<FormGroup row>
																		<Label for="address" sm={firstColSize}>Primary Address</Label>
																		<Col sm={secondColSize}>
																			<GeoSuggest onSelect={(suggestion: Suggest) => { this.setState({ ...this.state, location: { streetAddress: suggestion.label, lat: parseFloat(suggestion.location.lat), long: parseFloat(suggestion.location.lng) } }); }} />
																		</Col>
																	</FormGroup>
																	<FormGroup row>
																		<Label for="name" sm={firstColSize}>About</Label>
																		<Col sm={secondColSize}>
																			<Input type="textarea" name="aboutInput" defaultValue={result.data!.user!.about} onChange={(e: React.ChangeEvent<HTMLInputElement>) => this.setState({ ...this.state, about: e.target.value })} />
																		</Col>
																	</FormGroup>
																	<Button className="float-right" type="submit">Submit</Button>{" "}
																	<Button className="float-right" style={{ marginRight: 5 }} onClick={this.toggle}>Cancel</Button>
																</Form>
															</ModalBody>
														</Modal>
													</div>
												);
											}}
										</Mutation>
									) : undefined
								}
							</div>
							<div id="profile-header-right-container">
								<div id="profile-header-about-container">
									<p id="profile-header-about">{result.data!.user!.about}</p>
								</div>
								<div id="profile-header-contact-info">
									{result.data!.user!.email === undefined ? undefined : <div>Email: {result.data!.user!.email}</div>}
									{result.data!.user!.phoneNumber === undefined ? undefined : <div>Phone Number: {result.data!.user!.phoneNumber}</div>}
								</div>
								<div id="profile-header-joined">Joined {
									((joinedAt: string): string => {
										const date = new Date(joinedAt);
										return (
											`${date.getMonth()}/${date.getDate()}/${date.getFullYear()}`
										);
									})(result.data!.user!.createdAt!)
								}
								</div>
							</div>
						</div>
					);
				}}
			</Query>
		);
	}
}
