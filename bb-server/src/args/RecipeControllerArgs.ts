import { DeepPartial } from "typeorm";
import { Allergy, Tag } from "../entities";

export interface IRecipeArgs {
	id: number;
}

export interface IRecipeReviewArgs {
	id: number;
}

export interface IRecipeEditArgs {
	id: number;
	name?: string;
	description?: string;
	imagePath?: string;
}

export interface IRecipeSaveArgs {
	name: string;
	description?: string;
	imagePath?: string;
}

export interface IRecipeReviewSaveArgs {
	rating: number;
	description?: string;
	subjectID: number;
}

export interface IRecipeReviewEditArgs {
	id: number;
	rating?: number;
	description?: string;
}

export interface IRecipeToggleTagsArgs {
	id: number;
	tags: DeepPartial<Tag>[];
}

export interface IRecipeToggleAllergiesArgs {
	id: number;
	allergies: DeepPartial<Allergy>[];
}
