import Allergy from "./Allergy";
import Ingredient from "./Ingredient";
import Meal from "./Meal";
import Recipe from "./Recipe";
import RecipeReview from "./RecipeReview";
import Tag from "./Tag";
import Topic from "./Topic";
import User from "./User";
import UserReview from "./UserReview";

// tslint:disable-next-line: no-any
export const entities: any[] = [
    Ingredient, Meal, Recipe, Allergy, UserReview, RecipeReview, Tag, Topic, User,
];
