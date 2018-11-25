import React from "react";
import { Button, ButtonGroup } from "reactstrap";
import Meal from "../entities/Meal";
import Recipe from "../entities/Recipe";
import User from "../entities/User";
import MealSummariesContainer from "./MealSummariesContainer";
import ProfileSummariesContainers from "./ProfileSummariesContainers";
import RecipeSummariesContainer from "./RecipeSummariesContainer";
import "./resources/css/ProfileActivityContainer.css";

enum RenderedComponent {
	HostedMeals,
	AuthoredRecipes,
	SavedRecipes,
	FollowedUsers,
}

interface IProfileActivityContainerProps {
	hostedMeals: Partial<Meal>[];
	authoredRecipes: Partial<Recipe>[];
	savedRecipes: Partial<Recipe>[];
	followedUsers: Partial<User>[];
}

interface IProfileActivityContainerState {
	renderedComponent: RenderedComponent;
}

export default class ProfileActivityContainer extends React.Component<IProfileActivityContainerProps, IProfileActivityContainerState> {
	constructor(props: IProfileActivityContainerProps) {
		super(props);

		this.state = {
			renderedComponent: RenderedComponent.HostedMeals,
		};
	}

	private renderActivity = (): JSX.Element | undefined => {
		const nada = <div id="nada" className="card">None</div>;
		switch (this.state.renderedComponent) {
			case RenderedComponent.HostedMeals: {
				return this.props.hostedMeals.length === 0
					? nada
					: <MealSummariesContainer meals={this.props.hostedMeals} />;
			}
			case RenderedComponent.AuthoredRecipes: {
				return this.props.authoredRecipes.length === 0
					? nada
					: <RecipeSummariesContainer recipes={this.props.authoredRecipes} />;
			}
			case RenderedComponent.SavedRecipes: {
				return this.props.savedRecipes.length === 0
					? nada
					: <RecipeSummariesContainer recipes={this.props.savedRecipes} />;
			}
			case RenderedComponent.FollowedUsers: {
				return this.props.followedUsers.length === 0
					? nada
					: <ProfileSummariesContainers users={this.props.followedUsers} />;
			}
			default: {
				return undefined;
			}
		}
	}

	public render(): JSX.Element {
		return (
			<div id="profile-activity-container" className="profile-activity-container-class">
				<div id="profile-activity-selector">
					<ButtonGroup>
						<Button
							className="show-filter-modal"
							active={this.state.renderedComponent === 0}
							onClick={() => this.setState({ renderedComponent: RenderedComponent.HostedMeals })}
						>
							Hosted Meals
						</Button>
						<Button
							className="show-filter-modal"
							active={this.state.renderedComponent === 1}
							onClick={() => this.setState({ renderedComponent: RenderedComponent.AuthoredRecipes })}
						>
							Authored Recipes
						</Button>
						<Button
							className="show-filter-modal"
							active={this.state.renderedComponent === 2}
							onClick={() => this.setState({ renderedComponent: RenderedComponent.SavedRecipes })}
						>
							Saved Recipes
						</Button>
						<Button
							className="show-filter-modal"
							active={this.state.renderedComponent === 3}
							onClick={() => this.setState({ renderedComponent: RenderedComponent.FollowedUsers })}
						>
							Followed Users
						</Button>
					</ButtonGroup>
				</div>
				<div>
					{this.renderActivity()}
				</div>
			</div>
		);
	}
}
