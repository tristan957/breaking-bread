import Allergy from "./Allergy";
import Meal from "./Meal";
import Recipe from "./Recipe";
import RecipeReview from "./RecipeReview";
import Tag from "./Tag";
import Topic from "./Topic";
import User from "./User";
import UserReview from "./UserReview";

export { default as Allergy } from "./Allergy";
export { default as Meal } from "./Meal";
export { default as Recipe } from "./Recipe";
export { default as RecipeReview } from "./RecipeReview";
export { default as Tag } from "./Tag";
export { default as Topic } from "./Topic";
export { default as User } from "./User";
export { default as UserReview } from "./UserReview";

const entities: Function[] = [
	Meal, Recipe, Allergy, UserReview, RecipeReview, Tag, Topic, User,
];

export default entities;
