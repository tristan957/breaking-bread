import React from "react";
import { Link } from "react-router-dom";
import { Badge, Button, Col, Form, FormGroup, Input, InputGroup, InputGroupAddon, Label, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import Allergy from "../entities/Allergy";
import Tag from "../entities/Tag";
import ItemTags from "./ItemTags";
import "./resources/css/RecipeSummary.css";
import { default as defaultMealPic } from "./resources/images/default_meal_pic.jpg";

interface IRecipeSummaryProps {
	authorID: number;
	viewerID?: number;
	name: string;
	tags: Partial<Tag>[];
	imagePath?: string | null;
	createdAt: number;
	updatedAt: number;
	reviewAverage: number;
	timesSaved: number;
	allergies: Partial<Allergy>[];
	showAuthor?: boolean;
}

interface IRecipeSummaryState {
	modalOpen: boolean;
}

export default class RecipeSummary extends React.Component<IRecipeSummaryProps, IRecipeSummaryState> {
	constructor(props: IRecipeSummaryProps) {
		super(props);

		this.state = {
			modalOpen: false,
		};
	}

	private toggle = () => {
		this.setState({
			modalOpen: !this.state.modalOpen,
		});
	}

	public render(): JSX.Element {
		return (
			<div id="recipe-summary">
				<img src={this.props.imagePath || defaultMealPic} id="recipe-summary-img" alt="Recipe Picture" />
				<div id="recipe-summary-information">
					<div id="recipe-summary-left">
						<Link to={`/r/${this.props.authorID}`} className="black-link-with-underline">
							<h1 id="recipe-summary-name">
								{this.props.name}
							</h1>
						</Link>
						<span className="recipe-summary-updated">Last updated on
							{` ${new Date(this.props.updatedAt).toLocaleDateString()}`}
							{console.log(this.props.updatedAt)}
						</span>
						<div id="recipe-summary-badges">
							<Badge className="recipe-summary-badge-item" color="primary">
								⭐ {parseFloat(this.props.reviewAverage.toFixed(2))}/5
							</Badge>
							<Badge className="recipe-summary-badge-item" color="primary">
								❤️ {this.props.timesSaved}
							</Badge>
						</div>
						<div id="recipe-summary-buttons">
							{this.props.authorID === this.props.viewerID
								? <Button disabled outline color="secondary" className="recipe-summary-action">Review</Button>
								: <Button outline color="secondary" className="recipe-summary-action" onClick={this.toggle}>Review</Button>
							}
							<Modal isOpen={this.state.modalOpen} toggle={this.toggle}>
								<ModalHeader toggle={this.toggle}>Review Editor</ModalHeader>
								<ModalBody>
									<Form>
										<FormGroup row>
											<Label for="search" sm={3}>Rating</Label>
											<Col sm={9}>
												<InputGroup>
													<Input type="number" step="1" max={5} min={0} />
													<InputGroupAddon addonType="append">/ 5</InputGroupAddon>
												</InputGroup>
											</Col>
										</FormGroup>
										<FormGroup row>
											<Label for="search" sm={3}>Review</Label>
											<Col sm={9}>
												<InputGroup>
													<Input type="textarea" />
												</InputGroup>
											</Col>
										</FormGroup>
									</Form>
								</ModalBody>
								<ModalFooter>
									<Button color="success" onClick={this.toggle}>Submit</Button>{" "}
									<Button color="danger" onClick={this.toggle}>Cancel</Button>
								</ModalFooter>
							</Modal>
							<Button outline color="secondary" className="recipe-summary-action">Save</Button>
						</div>
					</div>
					<div id="recipe-summary-card-right">
						<div id="recipe-summary-tags">
							Tags
							<ItemTags color="info" names={this.props.tags.map(tag => tag.name)} />
						</div>
						<div id="recipe-summary-allergies">
							Allergies
							<ItemTags color="warning" names={this.props.allergies.map(allergy => allergy.name)} />
						</div>
					</div>
				</div>
			</div>
		);
	}
}
