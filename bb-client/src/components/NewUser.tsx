import { AvField, AvForm } from "availity-reactstrap-validation";
import React from "react";
import { Alert, Button, Col, FormGroup, Input, Label } from "reactstrap";
import GeoSuggest from "./GeoSuggest";
import "./resources/css/NewUser.css";

interface IRetreivedProfileInfo {
	email?: string;
	emailVerified?: boolean;
	lastName?: string;
	firstName?: string;
	picture?: string;
	validSubmit: Function;
}

interface INewUserState {
	location: {
		description?: string;
	};
}

export default class NewUser extends React.Component<IRetreivedProfileInfo> {
	constructor(props: IRetreivedProfileInfo) {
		super(props);
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
					<AvForm id="new-user-form" onValidSubmit={this.props.validSubmit}>
						<FormGroup row>
							<Label for="name" sm={firstColSize}>First Name</Label>
							<Col sm={secondColSize}>
								<AvField type="text" name="firstNameInput" defaultValue={this.props.firstName} required={true} />
							</Col>
						</FormGroup>
						<FormGroup row>
							<Label for="name" sm={firstColSize}>Last Name</Label>
							<Col sm={secondColSize}>
								<AvField type="text" name="lastNameInput" defaultValue={this.props.lastName} required={true} />
							</Col>
						</FormGroup>
						<FormGroup row>
							<Label for="name" sm={firstColSize}>Email</Label>
							<Col sm={9}>
								<AvField type="text" name="emailInput" defaultValue={this.props.email} required={true} />
							</Col>
						</FormGroup>
						<FormGroup row>
							<Label for="name" sm={firstColSize} required={true}>Primary address</Label>
							<Col sm={secondColSize}>
								<GeoSuggest onChange={(e) => console.log(e)} />
							</Col>
						</FormGroup>
						<FormGroup row>
							<Label for="name" sm={firstColSize}>Description</Label>
							<Col sm={secondColSize}>
								<Input type="textarea" name="descriptionInput" placeholder={"Tell us a little bit about yourself"} />
							</Col>
						</FormGroup>
						{/* <FormGroup row>
							<Label for="name" sm={firstColSize} required={true}>Topics</Label>
							<Col sm={secondColSize}>
								<Input type="text" name="topicsInput" placeholder={"List some topics that you enjoy discussing with others"} />
							</Col>
						</FormGroup> */}
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
