import Allergy from "./Allergy";
import Ingredient from "./Ingredient";
import RecipeReview from "./RecipeReview";
import Tag from "./Tag";
import User from "./User";

type Recipe = {
	id: number;
	name: string;
	description: string;
	recipeImageS3Key: string;
	createdAt: Date;
	updatedAt: Date;
	author: User;
	timesFavorited: number;
	reviews: RecipeReview[];
	tags: Tag[];
	ingredients: Ingredient[];
	allergies: Allergy[];
};

export default Recipe;
