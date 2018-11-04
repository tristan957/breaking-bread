import Recipe from "./Recipe";
import User from "./User";

type RecipeReview = {
	id: number;
	rating: number;
	description: string;
	createdAt: Date;
	updatedAt: Date;
	subject: Recipe;
	author: User;
};

export default RecipeReview;
