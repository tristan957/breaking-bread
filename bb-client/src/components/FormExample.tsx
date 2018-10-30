import React from "react";
import { ControlLabel, FormControl, FormGroup } from "react-bootstrap";
import "./resources/css/Font.css";
import "./resources/css/FormExample.css";

export default class FormExample extends React.Component {
	public render(): JSX.Element {
		return (
			<form className={"test"}>
				<FormGroup controlId="formBasicText">
					<ControlLabel>Search</ControlLabel>
					<FormControl type="text" placeholder="Enter text" />
					<FormControl.Feedback />
				</FormGroup>
			</form>
		);
	}
}
