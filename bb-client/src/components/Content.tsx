import React from "react";
import { Col, Row } from "reactstrap";
import MealCard from "./MealCard";
import "./resources/css/Background.css";
import logo from "./resources/images/logo_icon.png";

interface IFoodInfo {
	image: string;
}

export default class Content extends React.Component {
	public render(): JSX.Element {
		const food: IFoodInfo = { image: logo };
		return (
			<div id="background">
				<div id="logo">Breaking Bread</div>
				<Row>
					<Col sm="3">
						<MealCard cardInfo={food} />
					</Col>
					<Col sm="3">
						<MealCard cardInfo={food} />
					</Col>
				</Row>
			</div>
		);
	}
}
