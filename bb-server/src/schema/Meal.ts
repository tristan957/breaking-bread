import { Context } from "apollo-server-core";
import { gql, IResolvers } from "apollo-server-express";
import { DocumentNode, GraphQLResolveInfo } from "graphql";
import { DeepPartial } from "typeorm";
import { IAppContext } from "../App";
import Meal from "../entities/Meal";
import Recipe from "../entities/Recipe";

export const typeDef: DocumentNode = gql`
    extend type Mutation {
        createMeal(input: CreateRecipeInput!): Meal
        deleteMeal(mealId: Int!): Meal
        updateGuests(mealId: Int!, guests: [Int!]): Meal
        updateMeal(input: UpdateMealInput!): Meal
        updateRecipes(mealId: Int!, recipes: [GetRecipeInput!]!): Meal
    }

    extend type Query {
        getMeal(id: Int!): Meal
    }

    type Meal {
        id: Int!
        location: String!
        date: DateTime!
        name: String!
        createdAt: DateTime!
        updatedAt: DateTime!
        host: User!
        guests: [User!]
        recipes: [Recipe]!
    }

    input CreateMealInput {
        location: String!
        date: DateTime!
        name: String!
        host: UpdateUserInput!  # TODO: Verify request is from designated host JWT
    }

    input UpdateMealInput {
        id: Int!
        location: String
        date: DateTime
        name: String
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
    id: number;
}

interface IGetMeal {
    id: number;
}

interface IUpdateGuests {
    id: number;
    guests: number[];
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

        // TODO: remove/add recipes dependng on their existance in meal's recipe array
        // for (const recipe of recipes) {
        //     if (meal.recipes.) { }
        // }

        ctx.connection.getRepository(Meal).save(meal);
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

export async function getMeal(ctx: Context<IAppContext>, mealId: number): Promise<Meal | undefined> {
    const neededRelations: string[] = [
        "host", "guests", "recipes",
    ];
    return ctx.connection
        .getRepository(Meal)
        .findOne({
            where: {
                id: mealId,
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
