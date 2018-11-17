// tslint:disable: no-unsafe-any
import React from "react";
import MediaQuery from "react-responsive";
import { RouteComponentProps } from "react-router-dom";
import { UserContext } from "../App";
import Recipe from "../entities/Recipe";

interface IRecipePageParams {
	recipeID: string;
}

interface IRecipePageState {
	userLoggedIn?: Partial<Recipe>;
	recipe: Partial<Recipe>;
}

export default class RecipePage extends React.Component<RouteComponentProps<IRecipePageParams>, IRecipePageState> {
	constructor(props: RouteComponentProps<IRecipePageParams>) {
		super(props);

		this.fetchRecipeFromParams = this.fetchRecipeFromParams.bind(this);
	}

	private fetchRecipeFromParams(): Partial<Recipe> {
		const tempRecipe: Partial<Recipe> = {
			id: 2,
			name: "Ropa vieja",
			description: "A classic and a national dish of Cuba",
			timesFavorited: 10,
		};

		const recipeID: number = parseInt(this.props.match.params.recipeID, 10);

		return tempRecipe;
	}

	public render(): JSX.Element {
		return (
			<UserContext.Consumer>
				{userContext => {
					this.state = {
						userLoggedIn: userContext.user,
						recipe: this.fetchRecipeFromParams(),
					};

					return (
						<div>
							<MediaQuery query="(max-width: 949px)">
								<div>
									<div id="profile-header">
									</div>
								</div>
							</MediaQuery>

							<MediaQuery query="(min-width: 950px)">
								<div></div>
							</MediaQuery>
						</div>
					);
				}}
			</UserContext.Consumer>
		);
	}
}
