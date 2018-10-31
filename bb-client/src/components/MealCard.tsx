import React from "react";
import { Card, CardBody, CardImg, CardSubtitle, CardText, CardTitle } from "reactstrap";

interface IFoodInfo {
	image: string;
}

export default class MealCard extends React.Component<IFoodInfo, any> {
	constructor(props: IFoodInfo) {
		super(props);
	}
	public render(): JSX.Element {
		return (
			<div>
				<Card>
					<CardImg top width="100%" src={this.props.image} alt="meal image cap" />
					<CardBody>
						<CardTitle>meal title</CardTitle>
						<CardSubtitle>meal subtitle</CardSubtitle>
						<CardText>meal info</CardText>
						<a href="/MealProfile">details</a>
					</CardBody>
				</Card>
			</div>
		);
	}
}
