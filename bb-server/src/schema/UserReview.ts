import { gql, IResolvers } from "apollo-server-express";
import { DocumentNode, GraphQLResolveInfo } from "graphql";
import { getRepository } from "typeorm";
import UserReview from "../entities/UserReview";

export const typeDef: DocumentNode = gql`
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
`;

/**
 * Mutator Resolvers
 */



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
    Query: {
        getUserReview: _getUserReview,
    },
};
