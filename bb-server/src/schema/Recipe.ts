import { Context } from "apollo-server-core";
import { gql, IResolvers } from "apollo-server-express";
import { DocumentNode, GraphQLResolveInfo } from "graphql";
import { DeepPartial } from "typeorm";
import { IAppContext } from "../App";
import Ingredient from "../entities/Ingredient";
import Recipe from "../entities/Recipe";
import Tag from "../entities/Tag";
import User from "../entities/User";
import { getIngredient } from "./Ingredient";
import { createTag, getTag } from "./Tag";
import { getUser, updateUser } from "./User";

export const typeDef: DocumentNode = gql`
    extend type Mutation {
        createRecipe(input: CreateRecipeInput!): Recipe
        updateRecipe(input: UpdateRecipeInput!): Recipe
        updateTagList(recipeId: Int!, tags: [CreateTagInput]!): [Tag]
        updateIngredients(recipeId: Int!, ingredients: [CreateIngredientInput]!): [Tag]
        favoriteARecipe(recipeId: Int!, userId: Int!): Recipe
    }

    extend type Query {
        getRecipe(id: Int!): Recipe
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
`;

/**
 * Mutator Resolvers
 */

interface ICreateRecipe {
    input: DeepPartial<Recipe>;
}

// tslint:disable-next-line: no-any
function _createRecipe(parent: any, args: ICreateRecipe, ctx: Context<IAppContext>, info: GraphQLResolveInfo): Promise<DeepPartial<Recipe> | undefined> {
    return createRecipe(args.input, ctx);
}

export async function createRecipe(newRecipe: DeepPartial<Recipe>, ctx: Context<IAppContext>): Promise<DeepPartial<Recipe> | undefined> {
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
    return updateRecipe(args.input, ctx);
}

export async function updateRecipe(input: DeepPartial<Recipe>, ctx: Context<IAppContext>): Promise<Recipe | undefined> {
    if (input.id === undefined) {
        return Promise.resolve(undefined);
    }
    try {
        // TODO:
        // if ctx user is original author
        // if not, favorite (check if favorite), make copy (update input deeppartial<recipe>), then proceed

        const recipe: Recipe | undefined = await ctx.connection.getRepository(Recipe).save({
            ...getRecipe(input.id, ctx),
            ...input,
        });
        return recipe;
    } catch (reason) {
        console.log(reason);
        return Promise.reject(undefined);
    }
}

async function makeRecipeCopy(recipeId: number, ctx: Context<IAppContext>): Promise<Recipe | undefined> {
    const original: DeepPartial<Recipe> | undefined = await getRecipe(recipeId, ctx);
    if (original === undefined) {
        return Promise.resolve(undefined);
    }

    original.id = undefined;
    // TODO: Set author to user from JWT in context
    createRecipe(original, ctx);
}

interface IUpdateTagList {
    id: number;
    tags: DeepPartial<Tag>[];
}

// tslint:disable-next-line: no-any
function _updateTagList(parent: any, args: IUpdateTagList, ctx: Context<IAppContext>, info: GraphQLResolveInfo): Promise<Tag[] | undefined> {
    return updateTagList(args.id, args.tags, ctx);
}

export async function updateTagList(recipeId: number, tags: DeepPartial<Tag>[], ctx: Context<IAppContext>): Promise<Tag[] | undefined> {
    try {
        const recipe: Recipe | undefined = await getRecipe(recipeId, ctx);
        if (recipe === undefined) {
            return Promise.resolve(undefined);
        }
        // TODO: Need to verify id with JWT from context
        for (const tag of tags) {
            await createTag({ name: tag.name }, ctx);
        }

        recipe.tags = await newTagList(
            await tags.map(tag => tag.name),
            await recipe.tags.map(tag => tag.name),
            ctx
        );
        ctx.connection.getRepository(Tag).save(recipe);

        return recipe.tags;
    } catch (reason) {
        console.log(reason);
        return Promise.reject(undefined);
    }
}

async function newTagList(toggleTags: (string | undefined)[], recipeTags: (string | undefined)[], ctx: Context<IAppContext>): Promise<Tag[]> {
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
        const tag: Tag | undefined = await getTag({ name: newName }, ctx);
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
    return updateIngredients(args.id, args.ingredients, ctx);
}

export async function updateIngredients(recipeId: number, ingredients: DeepPartial<Ingredient>[], ctx: Context<IAppContext>): Promise<Ingredient[] | undefined> {
    try {
        const recipe: Recipe | undefined = await getRecipe(recipeId, ctx);
        if (recipe === undefined) {
            return Promise.resolve(undefined);
        }
        // TODO: Need to verify id with JWT from context (owner of recipe)

        // TODO: Ingredients should be created seperately or searched for before attaching to meals
        recipe.ingredients = await newIngredients(
            await ingredients.map(ingredient => ingredient.name),
            await recipe.ingredients.map(ingredient => ingredient.name),
            ctx
        );
        ctx.connection.getRepository(Recipe).save(recipe);

        return recipe.ingredients;
    } catch (reason) {
        console.log(reason);
        return Promise.reject(undefined);
    }
}

async function newIngredients(toggleIngredients: (string | undefined)[], recipeIngredients: (string | undefined)[], ctx: Context<IAppContext>): Promise<Ingredient[]> {
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
        const ingredient: Ingredient | undefined = await getIngredient({ name: newName }, ctx);
        if (ingredient !== undefined) {
            newList.push(ingredient);
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
    return favoriteARecipe(args.recipeId, args.userId, ctx);
}

export async function favoriteARecipe(recipeId: number, userId: number, ctx: Context<IAppContext>): Promise<Recipe | undefined> {
    let user: User | undefined = await getUser(userId, ctx);
    const recipe: Recipe | undefined = await getRecipe(recipeId, ctx);
    if (user === undefined) {
        return Promise.resolve(undefined);
    }
    if (recipe === undefined) {
        return Promise.resolve(undefined);
    }
    user.favoriteRecipes.push(recipe);
    user = await updateUser(user, ctx);    // User verification from ctx done here
    if (user === undefined) {
        Promise.resolve(undefined);
    }

    recipe.timesFavorited += 1;
    return ctx.connection.getRepository(Recipe).save({
        ...getRecipe(recipeId, ctx),
        ...recipe,
    });
}

/**
 * Query Resolvers
 */

interface IGetRecipe {
    id: number;
}

// tslint:disable-next-line: no-any
function _getRecipe(parent: any, args: IGetRecipe, ctx: Context<IAppContext>, info: GraphQLResolveInfo): Promise<Recipe | undefined> {
    return getRecipe(args.id, ctx);
}

export async function getRecipe(recipeId: number, ctx: Context<IAppContext>): Promise<Recipe | undefined> {
    const neededRelations: string[] = [
        "author", "tags", "ingredients", "reviews",
    ];
    return ctx.connection
        .getRepository(Recipe)
        .findOne({
            where: {
                id: recipeId,
            },
            relations: neededRelations,
        });
}

export const resolvers: IResolvers = {
    Mutation: {
        createRecipe: _createRecipe,
        updateRecipe: _updateRecipe,
        updateTags: _updateTagList,
        updateIngredients: _updateIngredients,
        favoriteARecipe: _favoriteARecipe,
    },
    Query: {
        getRecipe: _getRecipe,
    },
};
