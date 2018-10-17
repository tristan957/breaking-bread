import { gql, IResolvers } from "apollo-server-express";
import { DocumentNode, GraphQLResolveInfo } from "graphql";
import { DeepPartial, getConnection, Repository } from "typeorm";
import Topic from "../entities/Topic";
import User from "../entities/User";
import { createTopic, getTopic } from "./Topic";

export const typeDef: DocumentNode = gql`
    extend type Mutation {
        createUser(input: CreateUserInput!): User
        updateUser(input: UpdateUserInput!): User
        updateWhitelist(id: Int!, topics: [TopicInput]!): [Topic]
        updateBlacklist(id: Int!, topics: [TopicInput]!): [Topic]
    }

    extend type Query {
        getUser(id: Int!): User
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
    }

    input UpdateUserInput {
        id: Int!
        about: String
        email: String
        phoneNumber: String
    }
`;

/**
 * Mutator Resolvers
 */

interface ICreateUserInput {
    input: DeepPartial<User>;
}

// tslint:disable-next-line: no-any
function _createUser(parent: any, args: ICreateUserInput, ctx: any, info: GraphQLResolveInfo): Promise<DeepPartial<User> | undefined> {
    return createUser(args.input);
}

export async function createUser(newUser: DeepPartial<User>): Promise<DeepPartial<User> | undefined> {
    const userRepo: Repository<User> = getConnection().getRepository(User);

    try {
        const user: DeepPartial<User> = await userRepo.save(newUser);
        return user;
    } catch (reason) {
        console.log(reason);
        return undefined;
    }
}

interface IUpdateUser {
    input: DeepPartial<User>;
}

// tslint:disable-next-line: no-any
function _updateUser(parent: any, args: IUpdateUser, ctx: any, info: GraphQLResolveInfo): Promise<User | undefined> {
    return updateUser(args.input);
}

export async function updateUser(input: DeepPartial<User>): Promise<User | undefined> {
    if (input.id === undefined) {
        return undefined;
    }
    try {
        const user: User | undefined = await getConnection().getRepository(User).save({
            ...getUser(input.id),
            ...input,
        });
        return user;
    } catch (reason) {
        console.log(reason);
        return undefined;
    }
}

interface IUpdateWhitelist {
    id: number;
    topics: DeepPartial<Topic>[];
}

// tslint:disable-next-line: no-any
function _updateWhitelist(parent: any, args: IUpdateWhitelist, ctx: any, info: GraphQLResolveInfo): Promise<Topic[] | undefined> {
    return updateWhitelist(args.id, args.topics);
}

export async function updateWhitelist(id: number, topics: DeepPartial<Topic>[]): Promise<Topic[] | undefined> {
    try {
        const user: User | undefined = await getUser(id);
        if (user === undefined) {
            return Promise.reject(undefined);
        }
        for (const topic of topics) {
            await createTopic({ name: topic.name });
        }

        user.whitelist = await newTopicList(
            await topics.map(topic => topic.name),
            await user.whitelist.map(topic => topic.name)
        );
        getConnection().getRepository(User).save(user);

        return user.whitelist;
    } catch (reason) {
        console.log(reason);
        return undefined;
    }
}

// tslint:disable-next-line: no-any
function _updateBlacklist(parent: any, args: IUpdateWhitelist, ctx: any, info: GraphQLResolveInfo): Promise<Topic[] | undefined> {
    return updateBlacklist(args.id, args.topics);
}

export async function updateBlacklist(id: number, topics: DeepPartial<Topic>[]): Promise<Topic[] | undefined> {
    try {
        const user: User | undefined = await getUser(id);
        if (user === undefined) {
            return Promise.reject(undefined);
        }
        for (const topic of topics) {
            await createTopic({ name: topic.name });
        }

        user.blacklist = await newTopicList(
            await topics.map(topic => topic.name),
            await user.blacklist.map(topic => topic.name)
        );
        getConnection().getRepository(User).save(user);

        return user.blacklist;
    } catch (reason) {
        console.log(reason);
        return undefined;
    }
}

async function newTopicList(toggleTopics: (string | undefined)[], userTopics: (string | undefined)[]): Promise<Topic[]> {
    const namesRemoved: (string | undefined)[] = [];
    for (const name of userTopics) {
        const index: number = toggleTopics.indexOf(name);
        if (index >= 0) {
            await toggleTopics.splice(index, 1);
            namesRemoved.push(name);
        }
    }
    for (const name of namesRemoved) {
        await userTopics.splice(
            userTopics.indexOf(name), 1
        );
    }

    const newTopicNames: (string | undefined)[] = [...toggleTopics, ...userTopics];
    const newList: Topic[] = [];
    for (const name of newTopicNames) {
        const topic: Topic | undefined = await getTopic(undefined, name);
        if (topic !== undefined) {
            newList.push(topic);
        }
    }

    return newList;
}

/**
 * Query Resolvers
 */

interface IGetUser {
    id: number;
}

// tslint:disable-next-line: no-any
function _getUser(parent: any, args: IGetUser, ctx: any, info: GraphQLResolveInfo): Promise<User | undefined> {
    return  getUser(args.id);
}

export async function getUser(userReviewId: number): Promise<User | undefined> {
    const neededRelations: string[] = ["author", "subject"];
    return getConnection()
        .getRepository(User)
        .findOne({
            where: {
                id: userReviewId,
            },
            relations: neededRelations,
        });
}

export const resolvers: IResolvers = {
    Mutation: {
        createUser: _createUser,
        updateUser: _updateUser,
        updateWhitelist: _updateWhitelist,
        updateBlacklist: _updateBlacklist,
    },
    Query: {
        getUser: _getUser,
    },
};
