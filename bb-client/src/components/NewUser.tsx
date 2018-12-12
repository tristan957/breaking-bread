import { AvField, AvForm, AvGroup } from "availity-reactstrap-validation";
import React from "react";
import { Suggest } from "react-geosuggest";
import { Alert, Button, Col, FormGroup, Input, Label } from "reactstrap";
import GeoSuggest from "./GeoSuggest";
import "./resources/css/NewUser.css";

interface INewUserProps {
	email?: string;
	emailVerified?: boolean;
	lastName?: string;
	firstName?: string;
	picture?: string;
	validSubmit: Function;
}

export interface INewUserDetails {
	email?: string;
	lastName?: string;
	firstName?: string;
	phoneNumber?: string;
	description?: string;
	location?: Suggest;
}

interface INewUserState extends INewUserDetails { }

export default class NewUser extends React.Component<INewUserProps, INewUserState> {
	constructor(props: INewUserProps) {
		super(props);

		this.state = {
			email: this.props.email,
			lastName: this.props.lastName,
			firstName: this.props.firstName,
			location: undefined,
		};
	}

	public render(): JSX.Element {
		const firstColSize = 3;
		const secondColSize = 12 - firstColSize;
		return (
			<div>
				{
					this.props.emailVerified ? (
						<div></div>
					) : (
							<div>
								<Alert color="danger">
									You're email is unverified. Please use an account with a verified email.
							</Alert>
							</div>
						)
				}
				<div id="new-user-greeting">
					<h1>Come join the Breaking Bread community!</h1>
					<h2>Let's first finish setting up your acccount.</h2>
				</div>
				<div id="new-user-container">
					<AvForm id="new-user-form" onValidSubmit={() => {
						if (this.state.location !== undefined) {
							this.props.validSubmit(this.state as INewUserDetails);
						} else {
							alert("Need address");
						}
					}}>
						<AvGroup row required>
							<Label for="name" sm={firstColSize} required>First Name*</Label>
							<Col sm={secondColSize}>
								<AvField type="text" name="firstNameInput" defaultValue={this.props.firstName} required onChange={(e: React.ChangeEvent<HTMLInputElement>) => this.setState({ ...this.state, firstName: e.target.value })} />
							</Col>
						</AvGroup>
						<AvGroup row required>
							<Label for="name" sm={firstColSize} required>Last Name*</Label>
							<Col sm={secondColSize}>
								<AvField type="text" name="lastNameInput" defaultValue={this.props.lastName} required onChange={(e: React.ChangeEvent<HTMLInputElement>) => this.setState({ ...this.state, lastName: e.target.value })} />
							</Col>
						</AvGroup>
						<AvGroup row required>
							<Label for="name" sm={firstColSize} required>Phone*</Label>
							<Col sm={9}>
								<AvField type="tel" name="phoneInput" required onChange={(e: React.ChangeEvent<HTMLInputElement>) => this.setState({ ...this.state, phoneNumber: e.target.value })} />
							</Col>
						</AvGroup>
						<AvGroup row required>
							<Label for="name" sm={firstColSize}>Primary Address*</Label>
							<Col sm={secondColSize}>
								<GeoSuggest onSelect={(suggestion: Suggest) => { this.setState({ ...this.state, location: suggestion }); }} />
							</Col>
						</AvGroup>
						<FormGroup row>
							<Label for="name" sm={firstColSize}>Description</Label>
							<Col sm={secondColSize}>
								<Input type="textarea" name="descriptionInput" placeholder={"Tell us a little bit about yourself"} onChange={(e: React.ChangeEvent<HTMLInputElement>) => this.setState({ ...this.state, description: e.target.value })} />
							</Col>
						</FormGroup>
						<FormGroup row>
							<Col sm={firstColSize}></Col>
							<Col sm={secondColSize}>
								<Button className="float-right">Submit</Button>
							</Col>
						</FormGroup>
					</AvForm>
				</div>
			</div>
		);
	}
}
