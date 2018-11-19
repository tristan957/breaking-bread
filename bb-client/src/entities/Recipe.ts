import Allergy from "./Allergy";
import RecipeReview from "./RecipeReview";
import Tag from "./Tag";
import User from "./User";

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
	allergies: Partial<Allergy>[];
};

export default Recipe;
