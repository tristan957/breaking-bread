import { gql, IResolvers } from "apollo-server";
import { Context } from "apollo-server-core";
import { DocumentNode, GraphQLResolveInfo } from "graphql";
import { DeepPartial } from "typeorm";
import { IAppContext } from "../App";
import Recipe from "../entities/Recipe";
import RecipeReview from "../entities/RecipeReview";
import User from "../entities/User";
import { getRecipe } from "./Recipe";
import { getUser } from "./User";

export const typeDef: DocumentNode = gql`
	extend type Mutation {
		createRecipeReview(input: CreateRecipeReviewInput!): RecipeReview
		updateRecipeReview(input: UpdateRecipeReviewInput!): RecipeReview
	}

	extend type Query {
		getRecipeReview(id: Int!): RecipeReview
	}

	type RecipeReview {
		id: Int!
		rating: Int!
		description: String
		name: String!
		createdAt: DateTime!
		updatedAt: DateTime!
		subject: Recipe
		author: User
	}

	input CreateRecipeReviewInput {
		rating: Int!
		description: String
		subjectID: Int!
		authorID: Int!
	}

	input UpdateRecipeReviewInput {
		id: Int!
		rating: Int
		description: String
	}
`;

export const resolvers: IResolvers = {
	Mutation: {
		createRecipeReview: _createRecipeReview,
		updateRecipeReview: _updateRecipeReview,
	},
	Query: {
		getRecipeReview: _getRecipeReview,
	},
};

/**
 * Mutator Resolvers
 */

interface ICreateRecipeReview {
	input: DeepPartial<RecipeReview>;
}

// tslint:disable-next-line: no-any
function _createRecipeReview(parent: any, args: ICreateRecipeReview, ctx: Context<IAppContext>, info: GraphQLResolveInfo): Promise<DeepPartial<RecipeReview> | undefined> {
	return createRecipeReview(ctx, args.input);
}

export async function createRecipeReview(ctx: Context<IAppContext>, newReview: DeepPartial<RecipeReview>): Promise<DeepPartial<RecipeReview> | undefined> {
	if (newReview.author === undefined || newReview.subject === undefined) {
		return Promise.resolve(undefined);
	}
	if (newReview.author.id === undefined || newReview.subject.id === undefined) {
		return Promise.resolve(undefined);
	}
	try {
		const author: User | undefined = await getUser(ctx, newReview.author.id);
		const subject: Recipe | undefined = await getRecipe(ctx, { id: newReview.subject.id });
		if (author === undefined || subject === undefined) {
			return Promise.resolve(undefined);
		}
		// TODO: Check author is user from JWT in context

		newReview.author = author;
		newReview.subject = subject;
		const recipeReview: DeepPartial<RecipeReview> = await ctx.connection.getRepository(RecipeReview).save(newReview);
		return recipeReview;
	} catch (reason) {
		console.log(reason);
		return Promise.reject(undefined);
	}
}

interface IUpdateUserReview {
	input: DeepPartial<RecipeReview>;
}

// tslint:disable-next-line: no-any
function _updateRecipeReview(parent: any, args: IUpdateUserReview, ctx: Context<IAppContext>, info: GraphQLResolveInfo): Promise<RecipeReview | undefined> {
	return updateRecipeReview(ctx, args.input);
}

export async function updateRecipeReview(ctx: Context<IAppContext>, input: DeepPartial<RecipeReview>): Promise<RecipeReview | undefined> {
	if (input.id === undefined) {
		return Promise.resolve(undefined);
	}
	// TODO: Check author is user from JWT in context
	try {
		const userReview: RecipeReview | undefined = await ctx.connection.getRepository(RecipeReview).save({
			...getRecipeReview(ctx, input.id),
			...input,
		});
		return userReview;
	} catch (reason) {
		console.log(reason);
		return Promise.reject(undefined);
	}
}

/**
 * Query Resolvers
 */

interface IGetRecipeReview {
	id: number;
}

// tslint:disable-next-line: no-any
function _getRecipeReview(parent: any, args: IGetRecipeReview, ctx: Context<IAppContext>, info: GraphQLResolveInfo): Promise<RecipeReview | undefined> {
	return getRecipeReview(ctx, args.id);
}

async function getRecipeReview(ctx: Context<IAppContext>, reviewID: number): Promise<RecipeReview | undefined> {
	return ctx.connection.getRepository(RecipeReview)
		.findOne({
			where: {
				id: reviewID,
			},
			relations: ["subject"],
		});
}
