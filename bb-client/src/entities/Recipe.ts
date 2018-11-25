import Allergy from "./Allergy";
import Meal from "./Meal";
import RecipeReview from "./RecipeReview";
import Tag from "./Tag";
import User from "./User";

type Recipe = {
	id: number;
	name: string;
	description: string;
	imagePath: string;
	createdAt: number;
	updatedAt: number;
	author: Partial<User>;
	timesSaved: number;
	reviews: Partial<RecipeReview>[];
	tags: Partial<Tag>[];
	allergies: Partial<Allergy>[];
	mealsServedAt: Partial<Meal>[];
};

export default Recipe;
