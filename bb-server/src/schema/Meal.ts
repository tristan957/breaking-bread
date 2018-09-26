import { gql, IResolvers } from "apollo-server-express";
import { DocumentNode } from "graphql";

export const typeDef: DocumentNode = gql`
    extend type Query {
        meal(id: Int!): Meal,
    }

    type Meal {
        name: String!
    }
`;

export const resolvers: IResolvers = {
    Query: {
        meal: (parent, args, context, info) => {
            return {
                name: `Chicken caprese ${args.id}`,
            };
        },
    },
};
