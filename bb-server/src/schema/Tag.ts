import { gql, IResolvers } from "apollo-server-express";
import { DocumentNode } from "graphql";

export const typeDef: DocumentNode = gql`
    extend type Query {
        tag(id: Int!): Tag
    }

    type Tag {
        id: Int!
        name: String!
    }
`;

interface ITagQuery {
    id: number;
}

export const resolvers: IResolvers = {
    Query: {
        tag: (parent, args: ITagQuery, context, info) => {
            return {
                name: `Chicken caprese ${args.id}`,
            };
        },
    },
};
