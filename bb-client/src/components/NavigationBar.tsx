// tslint:disable: no-unsafe-any

import MarkdownInput from "@opuscapita/react-markdown";
import moment from "moment";
import React from "react";
import { SingleDatePicker } from "react-dates";
import "react-dates/initialize";
import { Link } from "react-router-dom";
import { Col, Dropdown, DropdownItem, DropdownMenu, DropdownToggle, FormGroup, Label, Nav, Navbar, NavbarBrand, NavItem } from "reactstrap";
import Rodal from "rodal";
import "./resources/css/NavigationBar.css";
import { default as logo } from "./resources/images/logo_icon.png";

interface iNavigationBarState {
	dropdownOpen: boolean;
	modalVisible: boolean;
	isRecipe: boolean;
	mealTitle: string | undefined;
	mealDate: Date | undefined;
	mealLocation: string | undefined;
	mealDescription: string;
	createdAt: moment.Moment | null;
	calendarFocused: boolean;
	mealTime: string;
	numGuest: string;
	pictures: FileList;
	tags: string;
}

interface params {
	value: any;
	insertAtCursorPosition: any;
}

export default class NavigationBar extends React.Component<any, iNavigationBarState> {
	public componentWillMount() {
		this.setState({
			dropdownOpen: false,
			modalVisible: false,
			numGuest: "1",
			mealDescription: "",
		});
	}

	public toggle() {
		this.setState({ dropdownOpen: !this.state.dropdownOpen });
	}

	public showMealModal() {
		this.setState({
			modalVisible: true,
			isRecipe: false,
		});
	}

	public showRecipeModal() {
		this.setState({
			modalVisible: true,
			isRecipe: true,
		});
	}

	public hideModal() {
		this.setState({ modalVisible: false });
	}

	public handleTitleChange(event: any): void {
		this.setState({ mealTitle: event.target.value });
	}

	public handleLocationChange(event: any): void {
		this.setState({ mealDate: event.target.value });
	}

	public handleDescriptionChange(value: any): void {
		this.setState({ mealDescription: value });
	}

	public onDateChange(date: moment.Moment | null): void {
		this.setState({
			createdAt: date,
		});
	}

	public onFocusChange(): void {
		this.setState({
			calendarFocused: !this.state.calendarFocused,
		});
	}

	public handleTimeChange(event: any): void {
		this.setState({
			mealTime: event.target.value
		});
	}

	public handleNumGuestChange(event: any): void {
		if (event.target.validity.valid) {
			this.setState({
				numGuest: event.target.value
			});
		}
	}

	public handlePic(pic: FileList) {
		this.setState({ pictures: pic });
	}

	public handleTagsChange(event: any): void {
		this.setState({
			tags: event.target.value
		});
	}

	public addNew() {
		this.hideModal();
	}

	public render(): JSX.Element {
		return (
			<div id="navbar">
				<Navbar color="light" light expand="md">
					<Link to="/">
						<NavbarBrand>
							<span><img className="brand" src={logo} height="30" /></span>
						</NavbarBrand>
					</Link>
					<Nav className="ml-auto" navbar>
						<NavItem>
							{/* This button triggers our modal (Rodal) */}
						</NavItem>
					</Nav>
					<Dropdown isOpen={this.state.dropdownOpen} toggle={this.toggle.bind(this)}>
						<DropdownToggle caret>
							+
						</DropdownToggle>
						<DropdownMenu>
							<DropdownItem onClick={this.showMealModal.bind(this)}>New Meal</DropdownItem>
							<DropdownItem divider />
							<DropdownItem onClick={this.showRecipeModal.bind(this)}>New Receipe</DropdownItem>
						</DropdownMenu>
					</Dropdown>
				</Navbar>
				<Rodal visible={this.state.modalVisible} onClose={this.hideModal.bind(this)} className="markdown-input_fullscreen">
					<div className="header">New</div>
					<div className="body">
						{!this.state.isRecipe &&
							<FormGroup row>
								<Label for="date" sm={2}>Date</Label>
								<Col sm={10}>
									<div>
										<span>Day: </span>
										<SingleDatePicker
											date={moment(this.state.mealDate)}
											focused={this.state.calendarFocused}
											onDateChange={this.onDateChange.bind(this)}
											onFocusChange={this.onFocusChange.bind(this)}
											id={"datepicker"}
											small={true}
											numberOfMonths={1}
										/>
										<label>
											Time:
										<input type="text" value={this.state.mealTime} onChange={e => this.handleTimeChange(e)} />
										</label>
									</div>
								</Col>
							</FormGroup>}
						<FormGroup row>
							<Label sm={2}>Title: </Label>
							<Col sm={10}>
								<input type="text" value={this.state.mealTitle} onChange={e => this.handleTitleChange(e)} />
							</Col>
						</FormGroup>
						{!this.state.isRecipe &&
							<FormGroup row>
								<Label sm={2}>Location: </Label>
								<Col sm={10}>
									<input type="text" value={this.state.mealLocation} onChange={e => this.handleLocationChange(e)} />
								</Col>
							</FormGroup>}
						{/* TODO: add markdown viewer */}
						<FormGroup row>
							<Label sm={3}>Description: </Label>
							<Col sm={10}>
								{/* TODO: solve the issue that the editor only can take one letter at a time */}
								{/* <textarea value={this.state.mealDescription} onChange={e => this.handleDescriptionChange(e)} /> */}
								<MarkdownInput
									onChange={(val: any) => this.handleDescriptionChange(val)}
									onBlur={() => console.log('blur')}
									value={this.state.mealDescription}
									autoFocus={false}
									readOnly={false}
									showFullScreenButton={true}
									hideToolbar={false}
									// locale='en'
									additionalButtons={[
										{
											iconElement: (<i className="fa fa-search"></i>),
											// tslint:disable-next-line
											handleButtonPress(params: any) {
												params.insertAtCursorPosition('#Product.old');
											},
											label: 'Product'
										},
									]}
								/>
							</Col>
						</FormGroup>
						{this.state.isRecipe &&
							<FormGroup row>
								<Label sm={6}>Tags: </Label>
								<Col sm={10}>
									<textarea value={this.state.tags} onChange={e => this.handleTagsChange(e)} />
								</Col>
							</FormGroup>}
						{!this.state.isRecipe &&
							<FormGroup row>
								<Label sm={6}>Number of Guest: </Label>
								<Col sm={10}>
									<input type="text" pattern="[0-9]*" inputMode="numeric" value={this.state.numGuest} onChange={e => this.handleNumGuestChange(e)} />
								</Col>
							</FormGroup>}
						<FormGroup row>
							<Label sm={6}>Upload Picture: </Label>
							<Col sm={10}>
								<input type="file" onChange={this.handlePic.bind(this)} />
							</Col>
						</FormGroup>
						<button onClick={this.addNew.bind(this)}>submit</button>
					</div>
				</Rodal>
			</div>
		);
	}
}
