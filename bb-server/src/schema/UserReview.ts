import { gql, IResolvers } from "apollo-server-express";
import { DocumentNode } from "graphql";

export const typeDef: DocumentNode = gql`
    extend type Query {
        userReview(id: Int!): UserReview,
    }

    type UserReview {
        name: String!,
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
