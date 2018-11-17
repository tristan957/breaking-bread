// tslint:disable: no-unsafe-any
import { History, Location } from "history";
import React from "react";
import MediaQuery from "react-responsive";
import Recipe from "../entities/Recipe";
import User from "../entities/User";

interface IRecipePageProps {
	history?: History;
	location?: Location;
	match?: {
		params: {
			userID: number;
		};
	};
	userLoggedIn?: Partial<User>;
}

interface IRecipePageState {
	recipe: Partial<Recipe>;
}

export default class RecipePage extends React.Component<IRecipePageProps, IRecipePageState> {
	constructor(props: IRecipePageProps) {
		super(props);

		this.state = {
			recipe: {},
		};
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
	}
}
