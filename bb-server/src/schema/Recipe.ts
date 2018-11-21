import { Context } from "apollo-server-core";
import { gql, IResolvers } from "apollo-server-express";
import { DocumentNode, GraphQLResolveInfo } from "graphql";
import { DeepPartial } from "typeorm";
import { IAppContext } from "../App";
import Allergy from "../entities/Allergy";
import Recipe from "../entities/Recipe";
import Tag from "../entities/Tag";
import User from "../entities/User";
import { getAllergy } from "./Allergy";
import { createTag, getTag } from "./Tag";
import { getUser, updateUser } from "./User";

export const typeDef: DocumentNode = gql`
    extend type Mutation {
        createRecipe(input: CreateRecipeInput!): Recipe
        updateRecipe(input: UpdateRecipeInput!): Recipe
        updateTags(recipeID: Int!, tags: [GetTagInput!]!): [Tag!]
        updateAllergies(recipeID: Int!, allergies: [GetAllergyInput!]!): [Allergy!]
        saveARecipe(recipeID: Int!, userID: Int!): Recipe
    }

    extend type Query {
        getRecipe(input: GetRecipeInput!): Recipe
    }

    type Recipe {
        id: Int!
        name: String!
        description: String!
        imagePath: String!
        createdAt: DateTime!
        updatedAt: DateTime!
        author: User
        reviews: [RecipeReview]
		timesSaved: Int!
        tags: [Tag]!
        allergies: [Allergy]!
    }

    input CreateRecipeInput {
        name: String!
        description: String
		imagePath: String
        author: UpdateUserInput!
    }

    input UpdateRecipeInput {
        id: Int!
        name: String
		imagePath: String
        description: String
    }

    input GetRecipeInput {
        id: Int
        name: String
    }
`;

/**
 * Mutator Resolvers
 */

interface ICreateRecipe {
	input: DeepPartial<Recipe>;
}

// tslint:disable-next-line: no-any
function _createRecipe(parent: any, args: ICreateRecipe, ctx: Context<IAppContext>, info: GraphQLResolveInfo): Promise<DeepPartial<Recipe> | undefined> {
	return createRecipe(ctx, args.input);
}

export async function createRecipe(ctx: Context<IAppContext>, newRecipe: DeepPartial<Recipe>): Promise<DeepPartial<Recipe> | undefined> {
	if (newRecipe.author === undefined) {
		return undefined;
	}
	try {
		const author: User | undefined = await ctx.connection.getRepository(User).findOne({
			where: {
				id: newRecipe.author.id,
			},
		});
		// TODO: Need to verify author.id with JWT from context
		if (author === undefined) {
			return Promise.resolve(undefined);
		}

		if (newRecipe.timesSaved === undefined) {
			newRecipe.timesSaved = 0;
		}
		newRecipe.author = author;
		const recipe: DeepPartial<Recipe> = await ctx.connection.getRepository(Recipe).save(newRecipe);
		return recipe;
	} catch (reason) {
		console.log(reason);
		return undefined;
	}
}

interface IUpdateRecipe {
	input: DeepPartial<Recipe>;
}

// tslint:disable-next-line: no-any
function _updateRecipe(parent: any, args: IUpdateRecipe, ctx: Context<IAppContext>, info: GraphQLResolveInfo): Promise<Recipe | undefined> {
	return updateRecipe(ctx, args.input);
}

export async function updateRecipe(ctx: Context<IAppContext>, input: DeepPartial<Recipe>): Promise<Recipe | undefined> {
	if (input.id === undefined) {
		return Promise.resolve(undefined);
	}
	try {
		// TODO:
		// if ctx user is original author
		// if not, favorite (check if favorite), make copy (update input deeppartial<recipe>), then proceed

		const recipe: Recipe | undefined = await ctx.connection.getRepository(Recipe).save({
			...getRecipe(ctx, { id: input.id }),
			...input,
		});
		return recipe;
	} catch (reason) {
		console.log(reason);
		return Promise.reject(undefined);
	}
}

// TODO: This. Maybe just front end
async function makeRecipeCopy(ctx: Context<IAppContext>, recipeID: number): Promise<Recipe | undefined> {
	const original: DeepPartial<Recipe> | undefined = await getRecipe(ctx, { id: recipeID });
	if (original === undefined) {
		return Promise.resolve(undefined);
	}

	original.id = undefined;
	// TODO: Set author to user from JWT in context
	createRecipe(ctx, original);
}

interface IUpdateTagList {
	id: number;
	tags: DeepPartial<Tag>[];
}

// tslint:disable-next-line: no-any
function _updateTagList(parent: any, args: IUpdateTagList, ctx: Context<IAppContext>, info: GraphQLResolveInfo): Promise<Tag[] | undefined> {
	return updateTagList(ctx, args.id, args.tags);
}

export async function updateTagList(ctx: Context<IAppContext>, recipeID: number, tags: DeepPartial<Tag>[]): Promise<Tag[] | undefined> {
	try {
		const recipe: Recipe | undefined = await getRecipe(ctx, { id: recipeID });
		if (recipe === undefined) {
			return Promise.resolve(undefined);
		}
		// TODO: Need to verify id with JWT from context
		for (const tag of tags) {
			await createTag(ctx, { name: tag.name });
		}

		recipe.tags = await newTagList(
			ctx,
			await tags.map(tag => tag.name),
			await recipe.tags.map(tag => tag.name)
		);
		ctx.connection.getRepository(Tag).save(recipe);

		return recipe.tags;
	} catch (reason) {
		console.log(reason);
		return Promise.reject(undefined);
	}
}

async function newTagList(ctx: Context<IAppContext>, toggleTags: (string | undefined)[], recipeTags: (string | undefined)[]): Promise<Tag[]> {
	const namesRemoved: (string | undefined)[] = [];
	for (const name of recipeTags) {
		const index: number = toggleTags.indexOf(name);
		if (index >= 0) {
			await toggleTags.splice(index, 1);
			namesRemoved.push(name);
		}
	}
	for (const name of namesRemoved) {
		await recipeTags.splice(
			recipeTags.indexOf(name), 1
		);
	}

	const newTagNames: (string | undefined)[] = [...toggleTags, ...recipeTags];
	const newList: Tag[] = [];
	for (const newName of newTagNames) {
		const tag: Tag | undefined = await getTag(ctx, { name: newName });
		if (tag !== undefined) {
			newList.push(tag);
		}
	}

	return newList;
}

interface IUpdateAllergies {
	id: number;
	allergies: DeepPartial<Allergy>[];
}

// tslint:disable-next-line: no-any
function _updateAllergies(parent: any, args: IUpdateAllergies, ctx: Context<IAppContext>, info: GraphQLResolveInfo): Promise<Allergy[] | undefined> {
	return updateAllergies(ctx, args.id, args.allergies);
}

export async function updateAllergies(ctx: Context<IAppContext>, recipeID: number, allergies: DeepPartial<Allergy>[]): Promise<Allergy[] | undefined> {
	try {
		const recipe: Recipe | undefined = await getRecipe(ctx, { id: recipeID });
		if (recipe === undefined) {
			return Promise.resolve(undefined);
		}
		// TODO: Need to verify id with JWT from context (owner of recipe)

		recipe.allergies = await newAllergies(
			ctx,
			await allergies.map(allergy => allergy.name),
			await recipe.allergies.map(allergy => allergy.name)
		);
		ctx.connection.getRepository(Recipe).save(recipe);

		return recipe.allergies;
	} catch (reason) {
		console.log(reason);
		return Promise.reject(undefined);
	}
}

async function newAllergies(ctx: Context<IAppContext>, toggleAllergies: (string | undefined)[], recipeAllergies: (string | undefined)[]): Promise<Allergy[]> {
	const namesRemoved: (string | undefined)[] = [];
	for (const name of recipeAllergies) {
		const index: number = toggleAllergies.indexOf(name);
		if (index >= 0) {
			await toggleAllergies.splice(index, 1);
			namesRemoved.push(name);
		}
	}
	for (const name of namesRemoved) {
		await recipeAllergies.splice(
			recipeAllergies.indexOf(name), 1
		);
	}

	const newAllergyNames: (string | undefined)[] = [...toggleAllergies, ...recipeAllergies];
	const newList: Allergy[] = [];
	for (const newName of newAllergyNames) {
		const allery: Allergy | undefined = await getAllergy(ctx, { name: newName });
		if (allery !== undefined) {
			newList.push(allery);
		}
	}

	return newList;
}

interface ISaveRecipe {
	recipeID: number;
	userID: number;
}

// tslint:disable-next-line: no-any
function _saveARecipe(parent: any, args: ISaveRecipe, ctx: Context<IAppContext>, info: GraphQLResolveInfo): Promise<Recipe | undefined> {
	return saveARecipe(ctx, args.recipeID, args.userID);
}

export async function saveARecipe(ctx: Context<IAppContext>, recipeID: number, userID: number): Promise<Recipe | undefined> {
	let user: User | undefined = await getUser(ctx, userID);
	const recipe: Recipe | undefined = await getRecipe(ctx, { id: recipeID });
	if (user === undefined) {
		return Promise.resolve(undefined);
	}
	if (recipe === undefined) {
		return Promise.resolve(undefined);
	}
	user.savedRecipes.push(recipe);
	user = await updateUser(ctx, user);    // User verification from ctx done here
	if (user === undefined) {
		Promise.resolve(undefined);
	}

	recipe.timesSaved += 1;
	return ctx.connection.getRepository(Recipe).save({
		...getRecipe(ctx, { id: recipeID }),
		...recipe,
	});
}

/**
 * Query Resolvers
 */

interface IGetRecipe {
	input: DeepPartial<Recipe>;
}

// tslint:disable-next-line: no-any
function _getRecipe(parent: any, args: IGetRecipe, ctx: Context<IAppContext>, info: GraphQLResolveInfo): Promise<Recipe | undefined> {
	return getRecipe(ctx, args.input);
}

export async function getRecipe(ctx: Context<IAppContext>, recipe: DeepPartial<Recipe>): Promise<Recipe | undefined> {
	const neededRelations: string[] = [
		"author", "reviews", "tags", "allergies",
	];

	if (recipe.id !== undefined) {
		return ctx.connection
			.getRepository(Recipe)
			.findOne({
				where: {
					id: recipe.id,
				},
				relations: neededRelations,
			});
	}

	if (recipe.name !== undefined) {
		return ctx.connection
			.getRepository(Recipe)
			.findOne({
				where: {
					name: recipe.name,
				},
				relations: neededRelations,
			});
	}

	return Promise.resolve(undefined);
}

export const resolvers: IResolvers = {
	Mutation: {
		createRecipe: _createRecipe,
		updateRecipe: _updateRecipe,
		updateTags: _updateTagList,
		updateAllergies: _updateAllergies,
		saveARecipe: _saveARecipe,
	},
	Query: {
		getRecipe: _getRecipe,
	},
};
