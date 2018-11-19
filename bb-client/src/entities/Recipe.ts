import Allergy from "./Allergy";
import RecipeReview from "./RecipeReview";
import Tag from "./Tag";
import User from "./User";

// TODO: Needs title
type Recipe = {
	id: number;
	name: string;
	description: string;
	imagePath: string;
	createdAt: Date;
	updatedAt: Date;
	author: Partial<User>;
	timesFavorited: number;
	reviews: Partial<RecipeReview>[];
	tags: Partial<Tag>[];
	// ingredients: Partial<Ingredient>[]; TODO: Need to get rid of ingredients
	allergies: Partial<Allergy>[];
};

export default Recipe;
