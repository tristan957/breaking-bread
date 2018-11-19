import React from "react";
import { Button, ButtonGroup } from "reactstrap";
import ProfileList from "../components/ProfileList";
import RecipeSummaries from "../components/RecipeSummaries";
import Meal from "../entities/Meal";
import Recipe from "../entities/Recipe";
import User from "../entities/User";
import MealSummariesContainer from "./MealSummariesContainer";
import "./resources/css/ProfileActivityContainer.css";

enum RenderSide {
	HostedMeals,
	AuthoredRecipes,
	FavoriteRecipes,
	FavoriteUsers,
}

interface IProfileActivityContainerProps {
	hostedMeals: Partial<Meal>[];
	authoredRecipes: Partial<Recipe>[];
	favoriteRecipes: Partial<Recipe>[];
	favoriteUsers: Partial<User>[];
}

interface IProfileActivityContainerState {
	render: RenderSide;
}

export default class ProfileActivityContainer extends React.Component<IProfileActivityContainerProps, IProfileActivityContainerState> {
	constructor(props: IProfileActivityContainerProps) {
		super(props);

		this.state = {
			render: RenderSide.HostedMeals,
		};
		this.changeRender = this.changeRender.bind(this);
		this.renderActivity = this.renderActivity.bind(this);
	}

	private changeRender(newRender: RenderSide): void {
		this.setState({
			render: newRender,
		});
	}

	private renderActivity(): JSX.Element | undefined {
		const nada: JSX.Element = (
			<div>
				😯 Nada! Get out there! Eat some food, meet some people!
			</div>
		);

		switch (this.state.render) {
			case RenderSide.HostedMeals: {
				return (
					<div>
						<div className="container-header">Hosted Meals</div>
						<hr className="seperator" />
						{
							this.props.hostedMeals.length === 0 ? nada : (
								<MealSummariesContainer
									meals={this.props.hostedMeals}
									showHosts={false}
								/>
							)
						}
					</div>
				);
			}
			case RenderSide.AuthoredRecipes: {
				return (
					<div>
						<div className="container-header">Authored Recipes</div>
						<hr className="seperator" />
						{
							this.props.authoredRecipes.length === 0 ? nada : (
								<RecipeSummaries recipes={this.props.authoredRecipes} />
							)
						}
					</div>
				);
			}
			case RenderSide.FavoriteRecipes: {
				return (
					<div>
						<div className="container-header">Favorite Recipes</div>
						<hr className="seperator" />
						{
							this.props.favoriteRecipes.length === 0 ? nada : (
								<RecipeSummaries recipes={this.props.favoriteRecipes} />
							)

						}
					</div>
				);
			}
			case RenderSide.FavoriteUsers: {
				return (
					<div>
						<div className="container-header">Favorite Users</div>
						<hr className="seperator" />
						{
							this.props.favoriteUsers.length === 0 ? nada : (
								<ProfileList users={this.props.favoriteUsers} />
							)
						}
					</div>
				);
			}
			default: {
				return undefined;
			}
		}
	}

	public render(): JSX.Element {
		return (
			<div id="profile-activity-container" className="profile-activity-container-class">
				<div>
					<ButtonGroup>
						<Button className="show-filter-modal" active={this.state.render === 0} onClick={() => this.changeRender(RenderSide.HostedMeals)}>Hosted Meals</Button>
						<Button className="show-filter-modal" active={this.state.render === 1} onClick={() => this.changeRender(RenderSide.AuthoredRecipes)}>Authored Recipes</Button>
						<Button className="show-filter-modal" active={this.state.render === 2} onClick={() => this.changeRender(RenderSide.FavoriteRecipes)}>Favorite Recipes</Button>
						<Button className="show-filter-modal" active={this.state.render === 3} onClick={() => this.changeRender(RenderSide.FavoriteUsers)}>Favorite Users</Button>
					</ButtonGroup>
				</div>
				<div className="card">
					{this.renderActivity()}
				</div>
			</div>
		);
	}
}
