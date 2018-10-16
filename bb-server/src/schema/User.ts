import { gql, IResolvers } from "apollo-server-express";
import { DocumentNode, GraphQLResolveInfo } from "graphql";
import { DeepPartial, getConnection, Repository } from "typeorm";
import Topic from "../entities/Topic";
import User from "../entities/User";
import { _createTopic, _getTopic } from "./Topic";

export const typeDef: DocumentNode = gql`
    extend type Mutation {
        createUser(input: CreateUserInput!): User
        updateUser(input: UpdateUserInput!): User
        updateWhitelist(id: Int!, topics: [TopicInput]!): [Topic]
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
function createUser(parent: any, args: ICreateUserInput, ctx: any, info: GraphQLResolveInfo): Promise<DeepPartial<User> | undefined> {
    return _createUser(args.input);
}

export async function _createUser(newUser: DeepPartial<User>): Promise<DeepPartial<User> | undefined> {
    try {
        const user: DeepPartial<User> = await userRepo.save(args.input);
        return user;
    } catch (reason) {
        console.log(reason);
        return undefined;
    }
}

interface IGetUser {
    id: number;
}

// tslint:disable-next-line: no-any
function getUser(parent: any, args: IGetUser, ctx: any, info: GraphQLResolveInfo): Promise<User | undefined> {
    if (args.id === undefined) {
        return Promise.reject(undefined);
    }

    return args.id !== undefined ? _getUser(args.id) : Promise.reject(undefined);
}

export async function _getUser(id: number): Promise<User | undefined> {
    return getConnection()
        .getRepository(User)
        .findOne({
            where: {
                id,
            },
            relations: [
                "hostedMeals", "whitelist", "blacklist",
                "reviews", "userReviewsAuthored", "recipeReviewsAuthored",
                "recipesAuthored",
            ],
        });
}

interface IUpdateUser {
    input: DeepPartial<User>;
}

// tslint:disable-next-line: no-any
function updateUser(parent: any, args: IUpdateUser, ctx: any, info: GraphQLResolveInfo): Promise<User | undefined> {
    return args.input.id !== undefined ? _updateUser(args.input) : Promise.reject(undefined);
}

export async function _updateUser(input: DeepPartial<User>): Promise<User | undefined> {
    if (input.id === undefined) {
        return undefined;
    }
    try {
        const user: User | undefined = await getConnection().getRepository(User).save({
            ..._getUser(input.id),
            ...input,
        });
        return user;
    } catch (reason) {
        console.log(reason);
        return undefined;
    }
}

export async function _updateWhitelist(id: number, topics: DeepPartial<Topic>[]): Promise<Topic[] | undefined> {
    const topicsRepo: Repository<Topic> = getConnection().getRepository(Topic);
    try {
        const user: User = await _getUser(id);
        for (const topic of topics) {
            if (await _getTopic(undefined, topic.name) === undefined) {
                await _createTopic({ name: topic.name });
            }
        }

        const names: (string | undefined)[] = topics.map(topic => topic.name);
    } catch (reason) {
        console.log(reason);
        return undefined;
    }
}

export const resolvers: IResolvers = {
    Mutation: {
        createUser,
        updateUser,
        updateWhitelist,
        // updateBlacklist,
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
