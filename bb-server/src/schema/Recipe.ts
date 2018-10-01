import { gql, IResolvers } from "apollo-server-express";
import { DocumentNode } from "graphql";

export const typeDef: DocumentNode = gql`
    extend type Query {
        recipe(id: Int!): Recipe,
    }

    type Recipe {
        name: String!,
    }
`;

interface IRecipeQuery {
    id: number;
}

export const resolvers: IResolvers = {
    Query: {
        recipe: (parent, args: IRecipeQuery, context, info) => {
            return {
                name: `test`,
            };
        },
    },
};
