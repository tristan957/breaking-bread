import * as React from "react";
import MealCard from "./MealCard";
import { Row, Col } from "reactstrap";
import * as logo from "./resources/images/logo_icon.png";
import "./resources/css/Background.css";

interface FoodInfo {
	image: string;
}

export default class Content extends React.Component {
	public render(): JSX.Element {
		const food: FoodInfo = { image: logo};
		return (
			<div id="background">
				<div id="logo">Breaking Bread</div>
				<Row>
					<Col sm="3">
						<MealCard cardInfo = {food}/>
					</Col>
					<Col sm="3">
						<MealCard cardInfo = {food}/>
					</Col>
				</Row>
			</div>
		);
	}
}
