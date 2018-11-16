import React from "react";
import MealSummaries from "../components/MealSummaries";
import ProfileList from "../components/ProfileList";
import RecipeSummaries from "../components/RecipeSummaries";
import Meal from "../entities/Meal";
import Recipe from "../entities/Recipe";
import User from "../entities/User";
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
	}

	private changeRender(newRender: RenderSide): void {
		this.setState({
			render: newRender,
		});
	}

	private renderActivity(): JSX.Element | undefined {
		const nada: JSX.Element = (
			<div>
				😯 Nada!
			</div>
		);

		switch (this.state.render) {
			case RenderSide.HostedMeals: {
				return (
					<div>
						<div className="tags-topics-list-header">Hosted Meals</div>
						<hr className="seperator" />
						{
							this.props.hostedMeals.length === 0 ? nada : (
								<MealSummaries
									meals={this.props.hostedMeals}
									showHosts={false}
								/>
							)
						}
					</div>
				);
				break;
			}
			case RenderSide.AuthoredRecipes: {
				return (
					<div>
						<div className="tags-topics-list-header">Authored Recipes</div>
						<hr className="seperator" />
						{
							this.props.authoredRecipes.length === 0 ? nada : (
								<RecipeSummaries recipes={this.props.authoredRecipes} />
							)
						}
					</div>
				);
				break;
			}
			case RenderSide.FavoriteRecipes: {
				return (
					<div>
						<div className="tags-topics-list-header">Favorite Recipes</div>
						<hr className="seperator" />
						{
							this.props.favoriteRecipes.length === 0 ? nada : (
								<RecipeSummaries recipes={this.props.favoriteRecipes} />
							)

						}
					</div>
				);
				break;
			}
			case RenderSide.FavoriteUsers: {
				return (
					<div>
						<div className="tags-topics-list-header">Favorite Users</div>
						<hr className="seperator" />
						{
							this.props.favoriteUsers.length === 0 ? nada : (
								<ProfileList users={this.props.favoriteUsers} />
							)
						}
					</div>
				);
				break;
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
					<button onClick={() => this.changeRender(RenderSide.HostedMeals)}>Hosted Meals</button>
					<button onClick={() => this.changeRender(RenderSide.AuthoredRecipes)}>Authored Recipes</button>
					<button onClick={() => this.changeRender(RenderSide.FavoriteRecipes)}>Favorite Recipes</button>
					<button onClick={() => this.changeRender(RenderSide.FavoriteUsers)}>Favorite Users</button>
				</div>
				<div className="card">
					{this.renderActivity()}
				</div>
			</div>
		);
	}
}
