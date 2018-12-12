import gql from "graphql-tag";
import React from "react";
import { Mutation, MutationFn, MutationResult, Query, QueryResult } from "react-apollo";
import { Suggest } from "react-geosuggest";
import { Button, Col, Form, FormGroup, Input, InputGroup, InputGroupAddon, Label, Modal, ModalBody, ModalHeader } from "reactstrap";
import GeoSuggest from "../components/GeoSuggest";
import LargeProfileSummary from "../components/LargeProfileSummary";
import User from "../entities/User";
import UserReview from "../entities/UserReview";
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
			reviews {
				id
				author {
					id
				}
				rating
				description
			}
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

const USER_REVIEW_SAVE = gql`
	mutation UserReviewSave($input: UserReviewSaveInput!) {
		userReviewSave(input: $input) {
			id
		}
	}
`;

interface IUserReviewSaveData {
	userReviewSave: Partial<UserReview>;
}

interface IUserReviewSaveVariables {
	input: {
		subjectID: number;
		rating: number;
		description: string;
	};
}

type UserReviewSaveResult = MutationResult<IUserReviewSaveData>;
type UserReviewSaveFn = MutationFn<IUserReviewSaveData, IUserReviewSaveVariables>;

const USER_REVIEW_EDIT = gql`
	mutation UserReviewEdit($input: UserReviewEditInput!) {
		userReviewEdit(input: $input) {
			id
		}
	}
`;

interface IUserReviewEditData {
	userReviewEdit: Partial<UserReview>;
}

interface IUserReviewEditVariables {
	input: {
		id: number;
		rating: number;
		description: string;
	};
}

type UserReviewEditResult = MutationResult<IUserReviewEditData>;
type UserReviewEditFn = MutationFn<IUserReviewEditData, IUserReviewEditVariables>;

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
	rating?: string;
	description?: string;
	editProfileModalOpen: boolean;
	userReviewModalOpen: boolean;
}

export default class ProfileHeaderContainer extends React.Component<IProfileHeaderProps, IProfileHeaderState> {
	constructor(props: IProfileHeaderProps) {
		super(props);

		this.state = { editProfileModalOpen: false, userReviewModalOpen: false };
	}

	private toggleEditProfile = (e: React.MouseEvent<HTMLButtonElement>): void => {
		this.setState({ ...this.state, editProfileModalOpen: !this.state.editProfileModalOpen });
	}

	private toggleUserReview = (): void => {
		this.setState({ ...this.state, userReviewModalOpen: !this.state.userReviewModalOpen });
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

					let userReview: Partial<UserReview> | undefined = undefined;
					const hasReview = result.data!.user!.reviews!.some(review => {
						if (review.author!.id === this.props.viewerID && this.props.viewerID !== undefined) {
							userReview = review;
							return true;
						}
						return false;
					});

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
								{this.props.viewerID === undefined || result.data!.user!.id! === this.props.viewerID
									? undefined
									: (
										<div id="profile-review-button">
											<Button onClick={(e: React.MouseEvent<HTMLButtonElement>) => this.toggleUserReview()}>{hasReview ? "Edit Review" : "Review"}</Button>
											{hasReview
												? (
													<Mutation mutation={USER_REVIEW_EDIT} onCompleted={() => result.refetch()}>
														{(userReviewEdit: UserReviewEditFn, mResult: UserReviewEditResult) => {
															if (result.error) {
																console.error(result.error);
																return <div>{result.error.message}</div>;
															}

															return (
																<Modal isOpen={this.state.userReviewModalOpen} toggle={this.toggleUserReview}>
																	<ModalHeader toggle={this.toggleUserReview}>Review Editor</ModalHeader>
																	<ModalBody>
																		<Form onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
																			userReviewEdit({
																				variables: {
																					input: {
																						id: userReview!.id!,
																						rating: parseInt(this.state.rating || userReview!.rating!.toString(), 10),
																						description: this.state.description!,
																					},
																				},
																			});
																			this.toggleUserReview();
																			e.preventDefault();
																		}}>
																			<FormGroup row>
																				<Label for="rating" sm={3}>Rating</Label>
																				<Col sm={9}>
																					<InputGroup>
																						<Input type="number" step="1" max={5} min={0} defaultValue={userReview!.rating!.toString()} onChange={(e: React.ChangeEvent<HTMLInputElement>) => this.setState({ ...this.state, rating: e.target.value })} />
																						<InputGroupAddon addonType="append">/ 5</InputGroupAddon>
																					</InputGroup>
																				</Col>
																			</FormGroup>
																			<FormGroup row>
																				<Label for="description" sm={3}>Review</Label>
																				<Col sm={9}>
																					<InputGroup>
																						<Input type="textarea" defaultValue={userReview!.description} onChange={(e: React.ChangeEvent<HTMLInputElement>) => this.setState({ ...this.state, description: e.target.value })} />
																					</InputGroup>
																				</Col>
																			</FormGroup>
																			<Button className="float-right" style={{ marginBottom: 0 }} color="success" type="submit">Submit</Button>
																			<Button className="float-right" style={{ marginRight: 5, marginBottom: 0 }} color="danger" onClick={(e: React.MouseEvent<HTMLButtonElement>) => this.toggleUserReview()}>Cancel</Button>
																		</Form>
																	</ModalBody>
																</Modal>
															);
														}}
													</Mutation>
												) : (
													<Mutation mutation={USER_REVIEW_SAVE} onCompleted={() => result.refetch()}>
														{(recipeReviewSave: UserReviewSaveFn, mResult: UserReviewSaveResult) => {
															if (result.error) {
																console.error(result.error);
																return <div>{result.error.message}</div>;
															}

															return (
																<Modal isOpen={this.state.userReviewModalOpen} toggle={this.toggleUserReview}>
																	<ModalHeader toggle={this.toggleUserReview}>Review Editor</ModalHeader>
																	<ModalBody>
																		<Form onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
																			recipeReviewSave({
																				variables: {
																					input: {
																						subjectID: this.props.userID,
																						rating: parseInt(this.state.rating!, 10),
																						description: this.state.description!,
																					},
																				},
																			});
																			this.toggleUserReview();
																			e.preventDefault();
																		}}>
																			<FormGroup row>
																				<Label for="rating" sm={3}>Rating</Label>
																				<Col sm={9}>
																					<InputGroup>
																						<Input type="number" step="1" max={5} min={0} onChange={(e: React.ChangeEvent<HTMLInputElement>) => this.setState({ ...this.state, rating: e.target.value })} />
																						<InputGroupAddon addonType="append">/ 5</InputGroupAddon>
																					</InputGroup>
																				</Col>
																			</FormGroup>
																			<FormGroup row>
																				<Label for="description" sm={3}>Review</Label>
																				<Col sm={9}>
																					<InputGroup>
																						<Input type="textarea" onChange={(e: React.ChangeEvent<HTMLInputElement>) => this.setState({ ...this.state, description: e.target.value })} />
																					</InputGroup>
																				</Col>
																			</FormGroup>
																			<Button className="float-right" style={{ marginBottom: 0 }} color="success" type="submit">Submit</Button>
																			<Button className="float-right" style={{ marginRight: 5, marginBottom: 0 }} color="danger" onClick={(e: React.MouseEvent<HTMLButtonElement>) => this.toggleUserReview}>Cancel</Button>
																		</Form>
																	</ModalBody>
																</Modal>
															);
														}}
													</Mutation>
												)
											}
										</div>
									)
								}
								{result.data!.user!.id! === this.props.viewerID
									? (
										<Mutation mutation={USER_EDIT} onCompleted={() => result.refetch()}>
											{(userEdit: UserEditFn, mResult: UserEditResult) => {
												if (mResult.error) {
													console.error(mResult.error);
													return <div>{mResult.error}</div>;
												}

												const firstColSize = 3;
												const secondColSize = 12 - firstColSize;

												return (
													<div id="edit-profile-button">
														<Button onClick={this.toggleEditProfile}>Edit Profile</Button>
														<Modal isOpen={this.state.editProfileModalOpen}>
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
																	this.setState({ ...this.state, editProfileModalOpen: !this.state.editProfileModalOpen });
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
																	<Button className="float-right" style={{ marginRight: 5 }} onClick={this.toggleEditProfile}>Cancel</Button>
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
