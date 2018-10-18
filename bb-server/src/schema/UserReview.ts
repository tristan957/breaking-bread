import { Context } from "apollo-server-core";
import { gql, IResolvers } from "apollo-server-express";
import { DocumentNode, GraphQLResolveInfo } from "graphql";
import { DeepPartial } from "typeorm";
import { IAppContext } from "../App";
import User from "../entities/User";
import UserReview from "../entities/UserReview";

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
        subject: User!
        author: User!
    }

    input CreateUserReviewInput {
        rating: Int!
        description: String
        subject: UpdateUserInput!
        author: UpdateUserInput!
    }

    input UpdateUserReviewInput {
        id: Int!
        rating: Int
        description: String
    }
`;

/**
 * Mutator Resolvers
 */

interface ICreateUserReview {
    input: DeepPartial<UserReview>;
}

// tslint:disable-next-line: no-any
function _createUserReview(parent: any, args: ICreateUserReview, ctx: Context<IAppContext>, info: GraphQLResolveInfo): Promise<DeepPartial<UserReview> | undefined> {
    return createUserReview(args.input, ctx);
}

export async function createUserReview(newReview: DeepPartial<UserReview>, ctx: Context<IAppContext>): Promise<DeepPartial<UserReview> | undefined> {
    if (newReview.author === undefined || newReview.subject === undefined) {
        return undefined;
    }
    try {
        const author: User | undefined = await ctx.connection.getRepository(User).findOne({
            where: {
                id: newReview.author.id,
            },
        });
        const subject: User | undefined = await ctx.connection.getRepository(User).findOne({
            where: {
                id: newReview.subject.id,
            },
        });
        if (author === undefined || subject === undefined) {
            return undefined;
        }

        newReview.author = author;
        newReview.subject = subject;
        const userReview: DeepPartial<UserReview> = await ctx.connection.getRepository(UserReview).save(newReview);
        return userReview;
    } catch (reason) {
        console.log(reason);
        return undefined;
    }
}

interface IUpdateUserReview {
    input: DeepPartial<UserReview>;
}

// tslint:disable-next-line: no-any
function _updateUserReview(parent: any, args: IUpdateUserReview, ctx: Context<IAppContext>, info: GraphQLResolveInfo): Promise<UserReview | undefined> {
    return updateUserReview(args.input, ctx);
}

export async function updateUserReview(input: DeepPartial<UserReview>, ctx: Context<IAppContext>): Promise<UserReview | undefined> {
    if (input.id === undefined) {
        return undefined;
    }
    try {
        const userReview: UserReview | undefined = await ctx.connection.getRepository(UserReview).save({
            ...getUserReview(input.id, ctx),
            ...input,
        });
        return userReview;
    } catch (reason) {
        console.log(reason);
        return undefined;
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
    return getUserReview(args.id, ctx);
}

async function getUserReview(reviewId: number, ctx: Context<IAppContext>): Promise<UserReview | undefined> {
    return ctx.connection.getRepository(UserReview)
        .findOne({
            where: {
                id: reviewId,
            },
            relations: ["subject", "author"],
        });
}

export const resolvers: IResolvers = {
    Mutation: {
        createUserReview: _createUserReview,
        updateUserReview: _updateUserReview,
    },
    Query: {
        getUserReview: _getUserReview,
    },
};
