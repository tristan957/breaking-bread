import { gql, IResolvers } from "apollo-server-express";
import { DocumentNode } from "graphql";
import { getConnection } from "typeorm";
import User from "../entities/User";

export const typeDef: DocumentNode = gql`
    extend type Query {
        user(id: Int!): User,
    }

    type User {
        id: Int!,
        firstName: String!,
        lastName: String!,
        about: String!,
        email: String!,
        phoneNumber: String!,
        createdAt: String!,
        whitelist: [Topic]!,
        blacklist: [Topic]!,
        reviews: [UserReview]!,
    }
`;

interface IUserQuery {
    id: number;
}

export const resolvers: IResolvers = {
    Query: {
        user: (parent, args: IUserQuery, context, info) => {
            return getConnection()
                .getRepository(User)
                .findOne({
                    where: {
                        id: args.id,
                    },
                    relations: [
                        "hostedMeals", "whitelist", "blacklist",
                        "reviews", "userReviewsAuthored", "recipeReviewsAuthored",
                        "recipesAuthored",
                    ],
                })
                .then(user => {
                    if (user === undefined) { return undefined; }

                    return user;
                });
        },
    },
};
