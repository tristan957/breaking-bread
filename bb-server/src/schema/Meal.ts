import { gql, IResolvers } from "apollo-server-express";
import { DocumentNode } from "graphql";

export const typeDef: DocumentNode = gql`
    extend type Query {
        meal(id: Int!): Meal
    }

    type Meal {
        id: Int!
        location: String!
        date: String!
        name: String!
        createdAt: DateTime!
        updatedAt: DateTime!
        host: User!
        guests: [User]!
        recipes: [Recipe]!
    }
`;

interface IMealQuery {
    id: number;
}

export const resolvers: IResolvers = {
    Query: {
        meal: (parent, args: IMealQuery, context, info) => {
            return {
                name: `Chicken caprese ${args.id}`,
            };
        },
    },
};
