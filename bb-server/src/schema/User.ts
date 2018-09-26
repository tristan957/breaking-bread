import { gql, IResolvers } from "apollo-server-express";
import { DocumentNode } from "graphql";

export const typeDef: DocumentNode = gql`
    extend type Query {
        user(id: Int!): User,
    }

    type User {
        username: String!
    }
`;

export const resolvers: IResolvers = {
    Query: {
        user: (parent, args, context, info) => {
            return {
                username: `Greg Noonan ${args.id}`,
            };
        },
    },
};
