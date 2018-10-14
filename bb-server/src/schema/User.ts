import { gql, IResolvers } from "apollo-server-express";
import { DocumentNode, GraphQLResolveInfo } from "graphql";
import { DeepPartial, getConnection, Repository } from "typeorm";
import User from "../entities/User";

export const typeDef: DocumentNode = gql`
    extend type Mutation {
        createUser(input: CreateUserInput!): User
    }

    extend type Query {
        user(id: Int!): User
    }

    type User {
        id: Int!
        firstName: String!
        lastName: String!
        about: String!
        email: String!
        phoneNumber: DateTime!
        createdAt: DateTime!
        whitelist: [Topic]!
        blacklist: [Topic]!
        reviews: [UserReview]!
    }

    input CreateUserInput {
        firstName: String!
        lastName: String!
        about: String
        email: String!
        phoneNumber: String!
        whitelist: [TopicInput]
        blacklist: [TopicInput]
    }
`;

interface ICreateUserInput {
    input: DeepPartial<User>;
}

// tslint:disable-next-line: no-any
async function createUser(parent: any, args: ICreateUserInput, ctx: any, info: GraphQLResolveInfo): Promise<DeepPartial<User> | undefined> {
    const userRepo: Repository<User> = getConnection().getRepository(User);
    try {
        const user: DeepPartial<User> = await userRepo.save(args.input);
        return user;
    } catch (reason) {
        console.log(reason);
        return undefined;
    }
}

interface IUserQuery {
    id: number;
}

export const resolvers: IResolvers = {
    Mutation: {
        createUser,
    },
    Query: {
        user: async (parent, args: IUserQuery, context, info) => {
            const user: User | undefined = await getConnection()
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
                });
            if (user === undefined) {
                return undefined;
            }
            return user;
        },
    },
};
