import { Context } from "apollo-server-core";
import { gql, IResolvers } from "apollo-server-express";
import { DocumentNode, GraphQLResolveInfo } from "graphql";
import { DeepPartial } from "typeorm";
import { IAppContext } from "../App";
import Meal from "../entities/Meal";
import Recipe from "../entities/Recipe";
import User from "../entities/User";
import { getRecipe } from "./Recipe";
import { getUser } from "./User";

export const typeDef: DocumentNode = gql`
    extend type Mutation {
        createMeal(input: CreateRecipeInput!): Meal
        deleteMeal(mealID: Int!): Meal
        updateGuests(mealID: Int!, guests: [Int!]): Meal
        updateMeal(input: UpdateMealInput!): Meal
        updateRecipes(mealID: Int!, recipes: [UpdateRecipeInput!]!): Meal
    }

    extend type Query {
        getMeal(id: Int!): Meal
    }

    type Meal {
        id: Int!
        location: String!
        date: DateTime!
		price: Float!
        title: String!
		description: String!
		imagePath: String!
		maxGuests: Int!
        createdAt: DateTime!
        updatedAt: DateTime!
        host: User
        guests: [User]
        recipes: [Recipe]!
    }

    input CreateMealInput {
        location: String!
        date: DateTime!
		price: Float!
        title: String!
		description: String
        host: UpdateUserInput!  # TODO: Verify request is from designated host JWT
		imagePath: String
		maxGuests: Int!
    }

    input UpdateMealInput {
        id: Int!
        location: String
        date: DateTime
		price: Float  # TODO: Def need to email on meal edit for price especially
        title: String
		description: String
		imagePath: String
		maxGuests: Int
    }
`;

/**
 * Mutation Resolvers
 */

interface ICreateMeal {
	input: DeepPartial<Meal>;
}

// tslint:disable-next-line: no-any
function _createMeal(parent: any, args: ICreateMeal, ctx: Context<IAppContext>, info: GraphQLResolveInfo): Promise<DeepPartial<Meal> | undefined> {
	return createMeal(ctx, args.input);
}

export async function createMeal(ctx: Context<IAppContext>, newMeal: DeepPartial<Meal>): Promise<DeepPartial<Meal> | undefined> {
	try {
		const meal: DeepPartial<Meal> = await ctx.connection.getRepository(Meal).save(newMeal);
		return meal;
	} catch (reason) {
		console.log(reason);
		return Promise.reject(undefined);
	}
}

interface IDeleteMeal {
	mealID: number;
}

// tslint:disable-next-line: no-any
function _deleteMeal(parent: any, args: IDeleteMeal, ctx: Context<IAppContext>, info: GraphQLResolveInfo): Promise<Meal | undefined> {
	return deleteMeal(ctx, args.mealID);
}

export async function deleteMeal(ctx: Context<IAppContext>, mealID: number): Promise<Meal | undefined> {
	const meal: Meal | undefined = await getMeal(ctx, mealID);
	if (meal === undefined) {
		return Promise.resolve(undefined);
	}

	ctx.connection.getRepository(Meal).delete(meal);
	return meal;
}

interface IUpdateMeal {
	input: DeepPartial<Meal>;
}

// tslint:disable-next-line: no-any
function _updateMeal(parent: any, args: IUpdateMeal, ctx: Context<IAppContext>, info: GraphQLResolveInfo): Promise<Meal | undefined> {
	return updateMeal(ctx, args.input);
}

export async function updateMeal(ctx: Context<IAppContext>, input: DeepPartial<Meal>): Promise<Meal | undefined> {
	if (input.id === undefined) {
		return Promise.resolve(undefined);
	}

	try {
		// TODO: Need to verify id with JWT from context
		const meal: Meal | undefined = await ctx.connection.getRepository(Meal).save({
			...getMeal(ctx, input.id),
			...input,
		});
		return meal;
	} catch (reason) {
		console.log(reason);
		return Promise.reject(undefined);
	}
}

interface IUpdateRecipes {
	id: number;
	recipes: DeepPartial<Recipe>[];
}

// tslint:disable-next-line: no-any
function _updateRecipes(parent: any, args: IUpdateRecipes, ctx: Context<IAppContext>, info: GraphQLResolveInfo): Promise<Meal | undefined> {
	return updateRecipes(ctx, args.id, args.recipes);
}

export async function updateRecipes(ctx: Context<IAppContext>, id: number, recipes: DeepPartial<Recipe>[]): Promise<Meal | undefined> {
	try {
		const meal: Meal | undefined = await getMeal(ctx, id);
		if (meal === undefined) {
			return Promise.resolve(undefined);
		}

		// TODO: Need to verify id with JWT from context
		for (const recipe of recipes) {
			if (await getRecipe(ctx, recipe) === undefined) {
				return Promise.resolve(undefined);
			}
		}

		meal.recipes = await newRecipeList(
			ctx,
			await recipes.map(recipe => recipe.id),
			await meal.recipes.map(recipe => recipe.id)
		);

		ctx.connection.getRepository(Meal).save(meal);
		return meal;
	} catch (reason) {
		console.log(reason);
		return Promise.reject(undefined);
	}
}

async function newRecipeList(ctx: Context<IAppContext>, toggleRecipes: (number | undefined)[], mealRecipes: (number | undefined)[]): Promise<Recipe[]> {
	const idsRemoved: (number | undefined)[] = [];
	for (const id of mealRecipes) {
		const index: number = toggleRecipes.indexOf(id);
		if (index >= 0) {
			await toggleRecipes.splice(index, 1);
			idsRemoved.push(id);
		}
	}
	for (const id of idsRemoved) {
		await mealRecipes.splice(
			mealRecipes.indexOf(id), 1
		);
	}

	const newRecipeIDs: (number | undefined)[] = [...toggleRecipes, ...mealRecipes];
	const newList: Recipe[] = [];
	for (const newID of newRecipeIDs) {
		const recipe: Recipe | undefined = await getRecipe(ctx, { id: newID });
		if (recipe !== undefined) {
			newList.push(recipe);
		}
	}

	return newList;
}

interface IUpdateGuests {
	mealID: number;
	guests: number[];
}

// tslint:disable-next-line: no-any
function _updateGuests(parent: any, args: IUpdateGuests, ctx: Context<IAppContext>, info: GraphQLResolveInfo): Promise<Meal | undefined> {
	return updateGuests(ctx, args.mealID, args.guests);
}

export async function updateGuests(ctx: Context<IAppContext>, mealID: number, guests: number[]): Promise<Meal | undefined> {
	try {
		const meal: Meal | undefined = await getMeal(ctx, mealID);
		if (meal === undefined) {
			return Promise.resolve(undefined);
		}

		// TODO: Need to verify id with JWT from context
		for (const guestID of guests) {
			const guest: User | undefined = await getUser(ctx, guestID);
			if (guest === undefined || guest.id === meal.host.id) {
				return Promise.resolve(undefined);
			}
		}

		meal.guests = await newGuestList(
			ctx,
			guests,
			await meal.guests.map(guest => guest.id)
		);

		ctx.connection.getRepository(Meal).save(meal);
		return meal;
	} catch (reason) {
		console.log(reason);
		return Promise.reject(undefined);
	}
}

async function newGuestList(ctx: Context<IAppContext>, toggleGuests: (number | undefined)[], mealGuests: (number | undefined)[]): Promise<User[]> {
	const idsRemoved: (number | undefined)[] = [];
	for (const id of mealGuests) {
		const index: number = toggleGuests.indexOf(id);
		if (index >= 0) {
			await toggleGuests.splice(index, 1);
			idsRemoved.push(id);
		}
	}
	for (const id of idsRemoved) {
		await mealGuests.splice(
			mealGuests.indexOf(id), 1
		);
	}

	const newGuestIDs: (number | undefined)[] = [...toggleGuests, ...mealGuests];
	const newList: User[] = [];
	for (const newID of newGuestIDs) {
		if (newID !== undefined) {
			const guest: User | undefined = await getUser(ctx, newID);
			if (guest !== undefined) {
				newList.push(guest);
			}
		}
	}

	return newList;
}

/**
 * Query Resolvers
 */

interface IGetMeal {
	id: number;
}

// tslint:disable-next-line: no-any
function _getMeal(parent: any, args: IGetMeal, ctx: Context<IAppContext>, info: GraphQLResolveInfo): Promise<Meal | undefined> {
	return getMeal(ctx, args.id);
}

export async function getMeal(ctx: Context<IAppContext>, mealID: number): Promise<Meal | undefined> {
	const neededRelations: string[] = [
		"host", "guests", "recipes",
	];
	return ctx.connection
		.getRepository(Meal)
		.findOne({
			where: {
				id: mealID,
			},
			relations: neededRelations,
		});
}

export const resolvers: IResolvers = {
	Mutation: {
		createMeal: _createMeal,
		deleteMeal: _deleteMeal,
		updateGuests: _updateGuests,
		updateMeal: _updateMeal,
		updateRecipes: _updateRecipes,
	},
	Query: {
		getMeal: _getMeal,
	},
};
