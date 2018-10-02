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
        phoneNumber: Float!,
        createdAt: Date!,
        hostedMeals: [Meal],
        whitelist: [Topic],
        blacklist: [Topic],
        reviews: [UserReview],
        userReviewsAuthored: [UserReview],
        recipeReviewsAuthored: [RecipeReview],
        recipesAuthored: [Recipe],
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

                    console.log(user);
                    return user;
                });
        },
    },
};
