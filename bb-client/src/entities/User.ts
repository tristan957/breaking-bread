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
	timesSaved: number;
	hostedMeals: Partial<Meal>[];
	mealsAttending: Partial<Meal>[];
	whitelist: Partial<Topic>[];
	blacklist: Partial<Topic>[];
	savedRecipes: Partial<Recipe>[];
	followedUsers: Partial<User>[];
	followers: Partial<User>[];
	followedTags: Partial<Tag>[];
	reviews: Partial<UserReview>[];
	userReviewsAuthored: Partial<UserReview>[];
	recipeReviewsAuthored: Partial<RecipeReview>[];
	recipesAuthored: Partial<Recipe>[];
};

export default User;
