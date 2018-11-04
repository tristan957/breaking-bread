import { Context } from "apollo-server-core";
import { gql, IResolvers } from "apollo-server-express";
import { DocumentNode, GraphQLResolveInfo } from "graphql";
import { DeepPartial } from "typeorm";
import { IAppContext } from "../App";
import Allergy from "../entities/Allergy";
import Ingredient from "../entities/Ingredient";
import Recipe from "../entities/Recipe";
import Tag from "../entities/Tag";
import User from "../entities/User";
import { getAllergy } from "./Allergy";
import { getIngredient } from "./Ingredient";
import { createTag, getTag } from "./Tag";
import { getUser, updateUser } from "./User";

export const typeDef: DocumentNode = gql`
    extend type Mutation {
        createRecipe(input: CreateRecipeInput!): Recipe
        updateRecipe(input: UpdateRecipeInput!): Recipe
        updateTags(recipeId: Int!, tags: [GetTagInput!]!): [Tag!]
        updateIngredients(recipeId: Int!, ingredients: [GetIngredientInput!]!): [Ingredient!]
        updateAllergies(recipeId: Int!, allergies: [GetAllergyInput!]!): [Allergy!]
        favoriteARecipe(recipeId: Int!, userId: Int!): Recipe
    }

    extend type Query {
        getRecipe(input: GetRecipeInput!): Recipe
    }

    type Recipe {
        id: Int!
        name: String!
        description: String!
        recipeImageS3Key: String!
        createdAt: DateTime!
        updatedAt: DateTime!
        author: User!
        reviews: [RecipeReview]!
        tags: [Tag]!
        ingredients: [Ingredient]!
        allergies: [Allergy]!
    }

    input CreateRecipeInput {
        name: String!
        description: String
        author: UpdateUserInput!
    }

    input UpdateRecipeInput {
        id: Int!
        name: String
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

        if (newRecipe.timesFavorited === undefined) {
            newRecipe.timesFavorited = 0;
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

async function makeRecipeCopy(ctx: Context<IAppContext>, recipeId: number): Promise<Recipe | undefined> {
    const original: DeepPartial<Recipe> | undefined = await getRecipe(ctx, { id: recipeId });
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

export async function updateTagList(ctx: Context<IAppContext>, recipeId: number, tags: DeepPartial<Tag>[]): Promise<Tag[] | undefined> {
    try {
        const recipe: Recipe | undefined = await getRecipe(ctx, { id: recipeId });
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

interface IUpdateIngredients {
    id: number;
    ingredients: DeepPartial<Ingredient>[];
}

// tslint:disable-next-line: no-any
function _updateIngredients(parent: any, args: IUpdateIngredients, ctx: Context<IAppContext>, info: GraphQLResolveInfo): Promise<Ingredient[] | undefined> {
    return updateIngredients(ctx, args.id, args.ingredients);
}

export async function updateIngredients(ctx: Context<IAppContext>, recipeId: number, ingredients: DeepPartial<Ingredient>[]): Promise<Ingredient[] | undefined> {
    try {
        const recipe: Recipe | undefined = await getRecipe(ctx, { id: recipeId });
        if (recipe === undefined) {
            return Promise.resolve(undefined);
        }
        // TODO: Need to verify id with JWT from context (owner of recipe)

        recipe.ingredients = await newIngredients(
            ctx,
            await ingredients.map(ingredient => ingredient.name),
            await recipe.ingredients.map(ingredient => ingredient.name)
        );
        ctx.connection.getRepository(Recipe).save(recipe);

        return recipe.ingredients;
    } catch (reason) {
        console.log(reason);
        return Promise.reject(undefined);
    }
}

async function newIngredients(ctx: Context<IAppContext>, toggleIngredients: (string | undefined)[], recipeIngredients: (string | undefined)[]): Promise<Ingredient[]> {
    const namesRemoved: (string | undefined)[] = [];
    for (const name of recipeIngredients) {
        const index: number = toggleIngredients.indexOf(name);
        if (index >= 0) {
            await toggleIngredients.splice(index, 1);
            namesRemoved.push(name);
        }
    }
    for (const name of namesRemoved) {
        await recipeIngredients.splice(
            recipeIngredients.indexOf(name), 1
        );
    }

    const newIngredientNames: (string | undefined)[] = [...toggleIngredients, ...recipeIngredients];
    const newList: Ingredient[] = [];
    for (const newName of newIngredientNames) {
        const ingredient: Ingredient | undefined = await getIngredient(ctx, { name: newName });
        if (ingredient !== undefined) {
            newList.push(ingredient);
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

export async function updateAllergies(ctx: Context<IAppContext>, recipeId: number, allergies: DeepPartial<Allergy>[]): Promise<Allergy[] | undefined> {
    try {
        const recipe: Recipe | undefined = await getRecipe(ctx, { id: recipeId });
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
        const allery: Ingredient | undefined = await getAllergy(ctx, { name: newName });
        if (allery !== undefined) {
            newList.push(allery);
        }
    }

    return newList;
}

interface IMakeFavoriteRecipe {
    recipeId: number;
    userId: number;
}

// tslint:disable-next-line: no-any
function _favoriteARecipe(parent: any, args: IMakeFavoriteRecipe, ctx: Context<IAppContext>, info: GraphQLResolveInfo): Promise<Recipe | undefined> {
    return favoriteARecipe(ctx, args.recipeId, args.userId);
}

export async function favoriteARecipe(ctx: Context<IAppContext>, recipeId: number, userId: number): Promise<Recipe | undefined> {
    let user: User | undefined = await getUser(ctx, userId);
    const recipe: Recipe | undefined = await getRecipe(ctx, { id: recipeId });
    if (user === undefined) {
        return Promise.resolve(undefined);
    }
    if (recipe === undefined) {
        return Promise.resolve(undefined);
    }
    user.favoriteRecipes.push(recipe);
    user = await updateUser(ctx, user);    // User verification from ctx done here
    if (user === undefined) {
        Promise.resolve(undefined);
    }

    recipe.timesFavorited += 1;
    return ctx.connection.getRepository(Recipe).save({
        ...getRecipe(ctx, { id: recipeId }),
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
        "author", "tags", "ingredients", "reviews", "allergies",
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
        updateIngredients: _updateIngredients,
        updateAllergies: _updateAllergies,
        favoriteARecipe: _favoriteARecipe,
    },
    Query: {
        getRecipe: _getRecipe,
    },
};
