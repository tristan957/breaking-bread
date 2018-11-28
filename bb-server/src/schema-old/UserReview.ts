import { gql, IResolvers } from "apollo-server";
import { Context } from "apollo-server-core";
import { DocumentNode, GraphQLResolveInfo } from "graphql";
import { DeepPartial } from "typeorm";
import { IAppContext } from "../App";
import User from "../entities/User";
import UserReview from "../entities/UserReview";
import { getUser } from "./User";

export const typeDef: DocumentNode = gql`
	extend type Mutation {
		createUserReview(input: CreateUserReviewInput!): UserReview
		updateUserReview(input: UpdateUserReviewInput!): UserReview
	}

	extend type Query {
		getUserReview(id: Int!): UserReview
	}

	type UserReview {
		id: Int!
		rating: Int!
		description: String
		createdAt: DateTime!
		updatedAt: DateTime!
		subject: User
		author: User
	}

	input CreateUserReviewInput {
		rating: Int!
		description: String
		subjectID: Int!
		authorID: Int!
	}

	input UpdateUserReviewInput {
		id: Int!
		rating: Int
		description: String
	}
`;

export const resolvers: IResolvers = {
	Mutation: {
		createUserReview: _createUserReview,
		updateUserReview: _updateUserReview,
	},
	Query: {
		getUserReview: _getUserReview,
	},
};

/**
 * Mutator Resolvers
 */

interface ICreateUserReview {
	input: DeepPartial<UserReview>;
}

// tslint:disable-next-line: no-any
function _createUserReview(parent: any, args: ICreateUserReview, ctx: Context<IAppContext>, info: GraphQLResolveInfo): Promise<DeepPartial<UserReview> | undefined> {
	return createUserReview(ctx, args.input);
}

export async function createUserReview(ctx: Context<IAppContext>, newReview: DeepPartial<UserReview>): Promise<DeepPartial<UserReview> | undefined> {
	if (newReview.author === undefined || newReview.subject === undefined) {
		return Promise.resolve(undefined);
	}
	if (newReview.author.id === undefined || newReview.subject.id === undefined) {
		return Promise.resolve(undefined);
	}
	try {
		const author: User | undefined = await getUser(ctx, newReview.author.id);
		const subject: User | undefined = await getUser(ctx, newReview.subject.id);
		if (author === undefined || subject === undefined) {
			return Promise.resolve(undefined);
		}
		// TODO: Check author is user from JWT in context

		newReview.author = author;
		newReview.subject = subject;
		const userReview: DeepPartial<UserReview> = await ctx.connection.getRepository(UserReview).save(newReview);
		return userReview;
	} catch (reason) {
		console.log(reason);
		return Promise.reject(undefined);
	}
}

interface IUpdateUserReview {
	input: DeepPartial<UserReview>;
}

// tslint:disable-next-line: no-any
function _updateUserReview(parent: any, args: IUpdateUserReview, ctx: Context<IAppContext>, info: GraphQLResolveInfo): Promise<UserReview | undefined> {
	return updateUserReview(ctx, args.input);
}

export async function updateUserReview(ctx: Context<IAppContext>, input: DeepPartial<UserReview>): Promise<UserReview | undefined> {
	if (input.id === undefined) {
		return Promise.resolve(undefined);
	}
	// TODO: Check author is user from JWT in context
	try {
		const userReview: UserReview | undefined = await ctx.connection.getRepository(UserReview).save({
			...getUserReview(ctx, input.id),
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

interface IGetUserReview {
	id: number;
}

// tslint:disable-next-line: no-any
function _getUserReview(parent: any, args: IGetUserReview, ctx: Context<IAppContext>, info: GraphQLResolveInfo): Promise<UserReview | undefined> {
	return getUserReview(ctx, args.id);
}

async function getUserReview(ctx: Context<IAppContext>, reviewID: number): Promise<UserReview | undefined> {
	return ctx.connection.getRepository(UserReview)
		.findOne({
			where: {
				id: reviewID,
			},
			relations: ["subject", "author"],
		});
}
