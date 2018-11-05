type RecipeReview = {
	id: number;
	rating: number;
	description: string;
	createdAt: Date;
	updatedAt: Date;
	subjectID: number;
	authorID: number;
};

export default RecipeReview;
