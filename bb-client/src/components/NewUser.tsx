import React from "react";
import { Alert, Button, Col, Form, FormGroup, Input, Label } from "reactstrap";
import "./resources/css/NewUser.css";

interface IRetreivedProfileInfo {
	email: string;
	emailVerified: boolean;
	lastName: string;
	firstName: string;
	picture: string;
}

export default class NewUser extends React.Component<IRetreivedProfileInfo> {
	public render(): JSX.Element {
		const firstColSize = 3;
		const secondColSize = 12 - firstColSize;
		return (
			<div>
				{
					this.props.emailVerified === true ? (
						<div></div>
					) : (
							<div>
								<Alert color="danger">
									You're email is unverified. Please sign up with a verified email.
							</Alert>
							</div>
						)
				}
				<div id="new-user-greeting">
					<h1>Come join the Breaking Bread community!</h1>
					<h2>Let's first finish setting up your acccount.</h2>
				</div>
				<div id="new-user-container">
					<Form id="new-user-form">
						<FormGroup row>
							<Label for="name" sm={firstColSize}>First Name</Label>
							<Col sm={secondColSize}>
								<Input type="text" name="firstNameInput" defaultValue={this.props.firstName} />
							</Col>
						</FormGroup>
						<FormGroup row>
							<Label for="name" sm={firstColSize}>Last Name</Label>
							<Col sm={secondColSize}>
								<Input type="text" name="lastNameInput" defaultValue={this.props.lastName} />
							</Col>
						</FormGroup>
						<FormGroup row>
							<Label for="name" sm={firstColSize}>Email</Label>
							<Col sm={9}>
								<Input type="text" name="emailInput" defaultValue={this.props.email} />
							</Col>
						</FormGroup>
						<FormGroup row>
							<Label for="name" sm={firstColSize}>Hometown</Label>
							<Col sm={secondColSize}>
								<Input type="text" name="hometownInput" />
							</Col>
						</FormGroup>
						<FormGroup row>
							<Label for="name" sm={firstColSize}>Description</Label>
							<Col sm={secondColSize}>
								<Input type="textarea" name="descriptionInput" placeholder={"Tell us a little bit about yourself"} />
							</Col>
						</FormGroup>
						<FormGroup row>
							<Label for="name" sm={firstColSize}>Topics</Label>
							<Col sm={secondColSize}>
								<Input type="text" name="topicsInput" placeholder={"List some topics that you enjoy discussing with others"} />
							</Col>
						</FormGroup>
						<FormGroup row>
							<Label for="name" sm={firstColSize}>Profile Picture</Label>
							<Col sm={secondColSize}>
								<Input type="text" name="profilePic" />
							</Col>
						</FormGroup>
						<FormGroup row>
							<Col sm={firstColSize}></Col>
							<Col sm={secondColSize}>
								<Button className="float-right">Submit</Button>
							</Col>
						</FormGroup>
					</Form>
				</div>
			</div>
		);
	}
}
