import { gql, IResolvers } from "apollo-server-express";
import { DocumentNode } from "graphql";

export const typeDef: DocumentNode = gql`
    extend type Query {
        recipe(id: Int!): Recipe,
    }

    type Recipe {
        id: Int!,
        name: String!,
        description: String!,
        createdAt: String!,
        updatedAt: String!,
        author: User!,
        reviews: [RecipeReview]!,
        tags: [Tag]!,
        ingredients: [Ingredient]!,
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
