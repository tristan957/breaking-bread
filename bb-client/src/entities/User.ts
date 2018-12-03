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
	name: string;
	imagePath: string;
	about: string;
	email: string;
	phoneNumber: string;
	createdAt: string;
	updatedAt: string;
	timesSaved: number;
	hostedMeals: Partial<Meal>[];
	recipes: Partial<Recipe>[];
	mealsAttending: Partial<Meal>[];
	upcomingMeals: Partial<Meal>[];
	whitelist: Partial<Topic>[];
	blacklist: Partial<Topic>[];
	savedRecipes: Partial<Recipe>[];
	followedUsers: Partial<User>[];
	followers: Partial<User>[];
	numberOfFollowers: number;
	followedTags: Partial<Tag>[];
	reviews: Partial<UserReview>[];
	reviewAverage: number;
	authoredUserReviews: Partial<UserReview>[];
	authoredRecipeReviews: Partial<RecipeReview>[];
	authoredRecipes: Partial<Recipe>[];
};

export default User;
