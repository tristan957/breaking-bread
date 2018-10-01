import { gql, IResolvers } from "apollo-server-express";
import { DocumentNode } from "graphql";

export const typeDef: DocumentNode = gql`
    extend type Query {
        ingredient(id: Int!): Ingredient,
    }

    type Ingredient {
        name: String!
    }
`;

interface IIngredientQuery {
    id: number;
}

export const resolvers: IResolvers = {
    Query: {
        ingredient: (parent, args: IIngredientQuery, context, info) => {
            return {
                name: `Chicken caprese ${args.id}`,
            };
        },
    },
};
