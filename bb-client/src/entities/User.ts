import Meal from "./Meal";
import Recipe from "./Recipe";
import RecipeReview from "./RecipeReview";
import Topic from "./Topic";
import UserReview from "./UserReview";

type User = {
	id: number;
	firstName: string;
	lastName: string;
	profilePictureS3Key: string;
	oAuthSub: string;
	about: string;
	email: string;
	phoneNumber: string;
	createdAt: Date;
	updatedAt: Date;
	timesFavorited: number;
	hostedMeals: Meal[];
	whitelist: Topic[];
	blacklist: Topic[];
	favoriteRecipes: Recipe[];
	favoriteUsers: User[];
	reviews: UserReview[];
	userReviewsAuthored: UserReview[];
	recipeReviewsAuthored: RecipeReview[];
	recipesAuthored: Recipe[];
};

export default User;
