import Recipe from "./Recipe";
import User from "./User";

type RecipeReview = {
	id: number;
	rating: number;
	description: string;
	createdAt: Date;
	updatedAt: Date;
	subject: Partial<Recipe>;
	author: Partial<User>;
};

export default RecipeReview;
