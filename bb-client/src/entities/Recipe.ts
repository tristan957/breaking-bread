import Allergy from "./Allergy";
import Ingredient from "./Ingredient";
import RecipeReview from "./RecipeReview";
import Tag from "./Tag";
import User from "./User";

// TODO: Needs title
type Recipe = {
	id: number;
	name: string;
	description: string;
	recipeImageS3Key: string;
	createdAt: Date;
	updatedAt: Date;
	author: Partial<User>;
	timesFavorited: number;
	reviews: Partial<RecipeReview>[];
	tags: Partial<Tag>[];
	ingredients: Partial<Ingredient>[];
	allergies: Partial<Allergy>[];
};

export default Recipe;
