import * as React from "react";
import { Card, CardImg, CardTitle, CardText, CardSubtitle, CardBody } from "reactstrap";

const MealCard = (props) => {
	return (
		<div>
			<Card>
				<CardImg top width="100%" src={ props.cardInfo.image } alt="meal image cap" />
				<CardBody>
					<CardTitle>meal title</CardTitle>
					<CardSubtitle>meal subtitle</CardSubtitle>
					<CardText>meal info</CardText>
					<a href="/MealProfile">details</a>
				</CardBody>
			</Card>
		</div>
	);
};

export default MealCard;
