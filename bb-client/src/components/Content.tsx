import React from "react";
import { Col, Row } from "reactstrap";
import MealCard from "./MealCard";
import "./resources/css/Background.css";
import logo from "./resources/images/logo_icon.png";

export default class Content extends React.Component {
	public render(): JSX.Element {
		return (
			<div id="background">
				<div id="logo">Breaking Bread</div>
				<Row>
					<Col sm="3">
						<MealCard image={logo} />
					</Col>
					<Col sm="3">
						<MealCard image={logo} />
					</Col>
				</Row>
			</div>
		);
	}
}
