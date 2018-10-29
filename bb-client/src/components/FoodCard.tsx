import * as React from "react";
import { Card, Button, CardImg, CardTitle, CardText, CardSubtitle, CardBody } from "reactstrap";

const FoodCard = (props) => {
	return (
		<div>
			<Card>
				<CardImg top width="100%" src={ props.cardInfo.image } alt="meal image cap" />
				<CardBody>
					<CardTitle>meal title</CardTitle>
					<CardSubtitle>meal subtitle</CardSubtitle>
					<CardText>This is a wider meal with supporting text below as a natural lead-in to additional content. This meal has even longer content than the first to show that equal height action.</CardText>
					<Button>Button</Button>
				</CardBody>
			</Card>
		</div>
	);
};

export default FoodCard;
