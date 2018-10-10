import { gql, IResolvers } from "apollo-server-express";
import { DocumentNode } from "graphql";

export const typeDef: DocumentNode = gql`
    extend type Query {
        recipeReview(id: Int!): RecipeReview
    }

    type RecipeReview {
        id: Int!
        rating: Int!
        description: String
        name: String!
        createdAt: DateTime!
        updatedAt: DateTime!
        subject: Recipe!
        author: User!
    }
`;

interface IRecipeReviewQuery {
    id: number;
}

export const resolvers: IResolvers = {
    Query: {
        recipeReview: (parent, args: IRecipeReviewQuery, context, info) => {
            return {
                name: `test`,
            };
        },
    },
};
