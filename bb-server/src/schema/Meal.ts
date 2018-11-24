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
        createMeal(input: CreateMealInput!): Meal
        deleteMeal(mealID: Int!): Meal
        toggleGuest(mealID: Int!, guestID: Int!): Meal
        updateMeal(input: UpdateMealInput!): Meal
        updateRecipes(mealID: Int!, recipes: [GetRecipeInput]!): Meal
    }

    extend type Query {
        getMeal(id: Int!): Meal
    }

    type Meal {
        id: Int!
        location: String!
        startTime: DateTime!
        endTime: DateTime!
		price: Float!
        title: String!
		description: String!
		imagePath: String!
		maxGuests: Int!
        createdAt: DateTime!
        updatedAt: DateTime!
        host: User
        guests: [User]
        recipes: [Recipe]
    }

    input CreateMealInput {
        location: String!  # Address or lat and lon
        startTime: DateTime!
        endTime: DateTime!
		price: Float!
        title: String!
		description: String
		imagePath: String
		maxGuests: Int!
    }

    input UpdateMealInput {
        id: Int!
        location: String
        startTime: DateTime  # TODO: Email on time, price changes
        endTime: DateTime
		price: Float
        title: String
		description: String
		imagePath: String
		maxGuests: Int
    }
`;

export const resolvers: IResolvers = {
	Mutation: {
		createMeal: _createMeal,
		deleteMeal: _deleteMeal,
		toggleGuest: _toggleGuest,
		updateMeal: _updateMeal,
		updateRecipes: _updateRecipes,
	},
	Query: {
		getMeal: _getMeal,
	},
};

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
		const host: User | undefined = await ctx.user;
		if (host === undefined) {
			throw Error;
		}

		// TODO: Verify location with google place api

		// TODO: Check if the host has a conflict SHOULD ALSO be done on frontend
		newMeal.host = host;
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

	ctx.connection.getRepository(Meal).remove(meal);

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
	mealID: number;
	recipes: DeepPartial<Recipe>[];
}

// tslint:disable-next-line: no-any
function _updateRecipes(parent: any, args: IUpdateRecipes, ctx: Context<IAppContext>, info: GraphQLResolveInfo): Promise<Meal | undefined> {
	return updateRecipes(ctx, args.mealID, args.recipes);
}

export async function updateRecipes(ctx: Context<IAppContext>, mealID: number, recipes: DeepPartial<Recipe>[]): Promise<Meal | undefined> {
	try {
		const meal: Meal | undefined = await getMeal(ctx, mealID);
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

interface IToggleGuest {
	mealID: number;
	guestID: number;
}

// tslint:disable-next-line: no-any
function _toggleGuest(parent: any, args: IToggleGuest, ctx: Context<IAppContext>, info: GraphQLResolveInfo): Promise<Meal | undefined> {
	return toggleGuest(ctx, args.mealID, args.guestID);
}

export async function toggleGuest(ctx: Context<IAppContext>, mealID: number, guestID: number): Promise<Meal | undefined> {
	try {
		const meal: Meal | undefined = await getMeal(ctx, mealID);
		const guest: User | undefined = await getUser(ctx, guestID);
		if (meal === undefined || guest === undefined) {
			return Promise.resolve(undefined);
		}
		// TODO: Check that the new guest is not the host
		// Need to also check if the guest does not have a conflict hosting or guesting

		const guestIDs: number[] = meal.guests.map(a => a.id);
		if (guestIDs.includes(guestID)) {
			const index: number = guestIDs.indexOf(guestID);
			meal.guests.splice(index, 1);
		} else {
			meal.guests.push(guest);
		}

		await updateMeal(ctx, meal);

		return meal;
	} catch (reason) {
		console.log(reason);
		return Promise.reject(undefined);
	}
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
