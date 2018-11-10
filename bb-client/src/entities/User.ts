import Meal from "./Meal";
import Recipe from "./Recipe";
import RecipeReview from "./RecipeReview";
import Tag from "./Tag";
import Topic from "./Topic";
import UserReview from "./UserReview";

type User = {
	id: number;
	firstName: string;
	lastName: string;
	imagePath: string;
	oAuthSub: string;
	about: string;
	email: string;
	phoneNumber: string;
	createdAt: Date;
	updatedAt: Date;
	timesFavorited: number;
	hostedMeals: Partial<Meal>[];
	mealsAttending: Partial<Meal>[];  // TODO: add to db, also when a meal is completed remove the meal from the list
	whitelist: Partial<Topic>[];
	blacklist: Partial<Topic>[];
	favoriteRecipes: Partial<Recipe>[];
	favoriteUsers: Partial<User>[];
	reviews: Partial<UserReview>[];
	userReviewsAuthored: Partial<UserReview>[];
	recipeReviewsAuthored: Partial<RecipeReview>[];
	recipesAuthored: Partial<Recipe>[];
	followedTags: Partial<Tag>[];
};

export default User;
