import { gql, IResolvers } from "apollo-server-express";
import { DocumentNode } from "graphql";

export const typeDef: DocumentNode = gql`
    extend type Query {
        userReview(id: Int!): UserReview,
    }

    type UserReview {
        id: Int!,
        rating: Int!,
        description: String!,
        subject: User!,
        author: User!,
    }
`;

interface IUserReviewQuery {
    id: number;
}

export const resolvers: IResolvers = {
    Query: {
        userReview: (parent, args: IUserReviewQuery, context, info) => {
            return {
                name: `test`,
            };
        },
    },
};
