import Recipe from "./Recipe";
import User from "./User";

type Tag = {
	id: number;
	name: string;
	associatedRecipes: Partial<Recipe>[];
	followers: Partial<User>[];
};

export default Tag;
