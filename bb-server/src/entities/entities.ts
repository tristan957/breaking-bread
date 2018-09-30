import Allergen from "./Allergen";
import Ingredient from "./Ingredient";
import Meal from "./Meal";
import Recipe from "./Recipe";
import RecipeReview from "./RecipeReview";
import Tag from "./Tag";
import Topic from "./Topic";
import User from "./User";
import UserReview from "./UserReview";

export const entities: Function[] = [
    Ingredient, Meal, Recipe, Allergen, UserReview, RecipeReview, Tag, Topic, User,
];
