// TODO: Needs title
type Recipe = {
	id: number;
	name: string;
	description: string;
	recipeImageS3Key: string;
	createdAt: Date;
	updatedAt: Date;
	authorID: number;
	timesFavorited: number;
	reviewIDs: number[];
	tagIDs: number[];
	ingredientIDs: number[];
	allergyIDs: number[];
};

export default Recipe;
