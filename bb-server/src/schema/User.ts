import { gql, IResolvers } from "apollo-server-express";
import { DocumentNode } from "graphql";

export const typeDef: DocumentNode = gql`
    extend type Query {
        user(id: Int!): User,
    }

    type User {
        firstName: String!,
        lastName: String!,
        about: String!,
        email: String!,
        phoneNumber: Float!,
        whitelist: [Topic]!,
        blacklist: [Topic]!,
        reviews: [Review]!,
    }
`;

interface IUserQuery {
    id: number;
}

export const resolvers: IResolvers = {
    Query: {
        user: (parent, args: IUserQuery, context, info) => {
            return {
                firstName: `Greg`,
                lastName: `Noonan`,
                reviews: {
                    name: `hi`,
                },
            };
        },
    },
};
