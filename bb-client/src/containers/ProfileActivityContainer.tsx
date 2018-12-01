import React from "react";
import MediaQuery from "react-responsive";
import { Button, ButtonGroup } from "reactstrap";
import HostedMealsContainer from "./HostedMealsContainer";
import RecipeSummariesContainer, { RecipeType } from "./RecipeSummariesContainer";
import UsersContainers, { UserType } from "./UsersContainers";

enum RenderedComponent {
	HOSTED_MEALS,
	AUTHORED_RECIPES,
	SAVED_RECIPES,
	FOLLOWED_USERS,
	FOLLOWING_USERS,
}

interface IProfileActivityContainerProps {
	userID: number;
}

interface IProfileActivityContainerState {
	renderedComponent: RenderedComponent;
}

export default class ProfileActivityContainer extends React.Component<IProfileActivityContainerProps, IProfileActivityContainerState> {
	constructor(props: IProfileActivityContainerProps) {
		super(props);

		this.state = {
			renderedComponent: RenderedComponent.HOSTED_MEALS,
		};
	}

	private renderActivity = (): JSX.Element | undefined => {
		const nada = <div id="nada" className="card">None</div>;
		switch (this.state.renderedComponent) {
			case RenderedComponent.HOSTED_MEALS: {
				return <HostedMealsContainer userID={this.props.userID} />;
			}
			case RenderedComponent.AUTHORED_RECIPES: {
				return <RecipeSummariesContainer userID={this.props.userID} type={RecipeType.AUTHORED} />;
			}
			case RenderedComponent.SAVED_RECIPES: {
				return <RecipeSummariesContainer userID={this.props.userID} type={RecipeType.SAVED} />;
			}
			case RenderedComponent.FOLLOWED_USERS: {
				return <UsersContainers userID={this.props.userID} type={UserType.FOLLOWED} />;
			}
			case RenderedComponent.FOLLOWING_USERS: {
				return <UsersContainers userID={this.props.userID} type={UserType.FOLLOWING} />;
			}
			default: {
				return nada;
			}
		}
	}

	public render(): JSX.Element {
		return (
			<div id="profile-activity-container" className="profile-activity-container-class">
				<div id="profile-activity-selector">
					<MediaQuery query="(min-width: 675px)">
						<ButtonGroup>
							<Button
								className="show-filter-modal"
								active={this.state.renderedComponent === 0}
								onClick={() => this.setState({ ...this.state, renderedComponent: RenderedComponent.HOSTED_MEALS })}
							>
								Hosted Meals
							</Button>
							<Button
								className="show-filter-modal"
								active={this.state.renderedComponent === 1}
								onClick={() => this.setState({ ...this.state, renderedComponent: RenderedComponent.AUTHORED_RECIPES })}
							>
								Authored Recipes
							</Button>
							<Button
								className="show-filter-modal"
								active={this.state.renderedComponent === 2}
								onClick={() => this.setState({ ...this.state, renderedComponent: RenderedComponent.SAVED_RECIPES })}
							>
								Saved Recipes
							</Button>
							<Button
								className="show-filter-modal"
								active={this.state.renderedComponent === 3}
								onClick={() => this.setState({ ...this.state, renderedComponent: RenderedComponent.FOLLOWED_USERS })}
							>
								Followed Users
							</Button>
							<Button
								className="show-filter-modal"
								active={this.state.renderedComponent === 4}
								onClick={() => this.setState({ ...this.state, renderedComponent: RenderedComponent.FOLLOWING_USERS })}
							>
								Users Following
							</Button>
						</ButtonGroup>
					</MediaQuery>

					<MediaQuery query="(max-width: 674px)">
						<ButtonGroup vertical>
							<Button
								className="show-filter-modal"
								active={this.state.renderedComponent === 0}
								onClick={() => this.setState({ ...this.state, renderedComponent: RenderedComponent.HOSTED_MEALS })}
							>
								Hosted Meals
							</Button>
							<Button
								className="show-filter-modal"
								active={this.state.renderedComponent === 1}
								onClick={() => this.setState({ ...this.state, renderedComponent: RenderedComponent.AUTHORED_RECIPES })}
							>
								Authored Recipes
							</Button>
							<Button
								className="show-filter-modal"
								active={this.state.renderedComponent === 2}
								onClick={() => this.setState({ ...this.state, renderedComponent: RenderedComponent.SAVED_RECIPES })}
							>
								Saved Recipes
							</Button>
							<Button
								className="show-filter-modal"
								active={this.state.renderedComponent === 3}
								onClick={() => this.setState({ ...this.state, renderedComponent: RenderedComponent.FOLLOWED_USERS })}
							>
								Followed Users
							</Button>
							<Button
								className="show-filter-modal"
								active={this.state.renderedComponent === 4}
								onClick={() => this.setState({ ...this.state, renderedComponent: RenderedComponent.FOLLOWING_USERS })}
							>
								Followed Users
							</Button>
						</ButtonGroup>
					</MediaQuery>
				</div>
				<div>
					{this.renderActivity()}
				</div>
			</div>
		);
	}
}
