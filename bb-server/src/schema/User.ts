import { gql, IResolvers } from "apollo-server-express";
import { DocumentNode } from "graphql";
import { getConnection } from "typeorm";
import User from "../entities/User";

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
        hostedMeals: [Meal],
        whitelist: [Topic],
        blacklist: [Topic],
        reviewSubjectList: [UserReview],
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
                .createQueryBuilder("user")
                .where(`"user"."id" = ${args.id}`)
                .getOne()
                .then(user => {
                    if (user === undefined) { return undefined; }

                    return user;
                });
        },
    },
};
