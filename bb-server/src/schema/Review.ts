import { gql, IResolvers } from "apollo-server-express";
import { DocumentNode } from "graphql";

export const typeDef: DocumentNode = gql`
    extend type Query {
        review(id: Int!): Review,
    }

    type Review {
        name: String!,
    }
`;

interface IReviewQuery {
    id: number;
}

export const resolvers: IResolvers = {
    Query: {
        review: (parent, args: IReviewQuery, context, info) => {
            return {
                name: `test`,
            };
        },
    },
};
