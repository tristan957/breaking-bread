import { gql, IResolvers } from "apollo-server-express";
import { DocumentNode } from "graphql";

export const typeDef: DocumentNode = gql`
    extend type Query {
        allergen(id: Int!): Allergen,
    }

    type Allergen {
        name: String!
    }
`;

interface IAllergenQuery {
    id: number;
}

export const resolvers: IResolvers = {
    Query: {
        allergen: (parent, args: IAllergenQuery, context, info) => {
            return {
                name: `Chicken caprese ${args.id}`,
            };
        },
    },
};
