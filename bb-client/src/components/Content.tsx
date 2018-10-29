import * as React from "react";
import FoodCard from "./FoodCard";
import { Row, Col } from "reactstrap";
import * as logo from "./resources/images/logo_icon.png";

interface FoodInfo {
	image: string;
}

export default class Content extends React.Component {
	public render(): JSX.Element {
		const food: FoodInfo = { image: logo};
		return (
			<div>
				<Row>
					<Col sm="3">
						<FoodCard cardInfo = {food}/>
					</Col>
					<Col sm="3">
						<FoodCard cardInfo = {food}/>
					</Col>
				</Row>
			</div>
		);
	}
}
