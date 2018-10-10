import { gql, IResolvers } from "apollo-server-express";
import { DocumentNode } from "graphql";

export const typeDef: DocumentNode = gql`
    extend type Query {
        allergy(id: Int!): Allergy
    }

    type Allergy {
        id: Int!
        name: String!
    }
`;

interface IAllergyQuery {
    id: number;
}

export const resolvers: IResolvers = {
    Query: {
        allergy: (parent, args: IAllergyQuery, context, info) => {
            return {
                name: `Chicken caprese ${args.id}`,
            };
        },
    },
};
