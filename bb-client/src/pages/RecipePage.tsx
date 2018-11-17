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
	recipe: Partial<Recipe>;
}

export default class RecipePage extends React.Component<RouteComponentProps<IRecipePageParams>, IRecipePageState> {
	constructor(props: RouteComponentProps<IRecipePageParams>) {
		super(props);
	}

	public componentWillMount(): void {
		// TODO: Fetch meal from server based on recipeID
		const tempRecipe: Partial<Recipe> = {
			id: 2,
			name: "Ropa vieja",
			description: "A classic and a national dish of Cuba",
			timesFavorited: 10,
		};

		this.setState({
			recipe: tempRecipe,
		});
	}

	public render(): JSX.Element {
		return (
			<UserContext.Consumer>
				{userContext => {
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
