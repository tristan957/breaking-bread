
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
	hostedMealsIDs: number[];
	whitelistIDs: number[];
	blacklistIDs: number[];
	favoriteRecipesIDs: number[];
	favoriteUsersIDs: number[];
	reviewsIDs: number[];
	userReviewsAuthoredIDs: number[];
	recipeReviewsAuthoredIDs: number[];
	recipesAuthoredIDs: number[];
};

export default User;
