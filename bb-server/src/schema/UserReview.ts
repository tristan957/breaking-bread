import { gql, IResolvers } from "apollo-server-express";
import { DocumentNode, GraphQLResolveInfo } from "graphql";
import { DeepPartial, getRepository } from "typeorm";
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
function _createUserReview(parent: any, args: ICreateUserReview, ctx: any, info: GraphQLResolveInfo): Promise<DeepPartial<UserReview> | undefined> {
    return createUserReview(args.input);
}

export async function createUserReview(newReview: DeepPartial<UserReview>): Promise<DeepPartial<UserReview> | undefined> {
    if (newReview.author === undefined || newReview.subject === undefined) {
        return undefined;
    }
    try {
        const author: User | undefined = await getRepository(User).findOne({
            where: {
                id: newReview.author.id,
            },
        });
        const subject: User | undefined = await getRepository(User).findOne({
            where: {
                id: newReview.subject.id,
            },
        });
        if (author === undefined || subject === undefined) {
            return undefined;
        }

        newReview.author = author;
        newReview.subject = subject;
        const userReview: DeepPartial<UserReview> = await getRepository(UserReview).save(newReview);
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
function _updateUserReview(parent: any, args: IUpdateUserReview, ctx: any, info: GraphQLResolveInfo): Promise<UserReview | undefined> {
    return updateUserReview(args.input);
}

export async function updateUserReview(input: DeepPartial<UserReview>): Promise<UserReview | undefined> {
    if (input.id === undefined) {
        return undefined;
    }
    try {
        const userReview: UserReview | undefined = await getRepository(UserReview).save({
            ...getUserReview(input.id),
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
function _getUserReview(parent: any, args: IGetUserReview, ctx: any, info: GraphQLResolveInfo): Promise<UserReview | undefined> {
    return  getUserReview(args.id);
}

async function getUserReview(reviewId: number): Promise<UserReview | undefined> {
    return getRepository(UserReview)
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
