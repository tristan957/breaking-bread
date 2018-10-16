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
        whitelist: [TopicInput]
        blacklist: [TopicInput]
    }

    input UpdateUserInput {
        id: Int!
        about: String
        email: String
        phoneNumber: String
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
    const userRepo: Repository<User> = getConnection().getRepository(User);

    try {
        const user: DeepPartial<User> = await userRepo.save(newUser);
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
    return  _getUser(args.id);
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
    return _updateUser(args.input);
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

interface IUpdateWhitelist {
    id: number;
    topics: DeepPartial<Topic>[];
}

// tslint:disable-next-line: no-any
function updateWhitelist(parent: any, args: IUpdateWhitelist, ctx: any, info: GraphQLResolveInfo): Promise<Topic[] | undefined> {
    return _updateWhitelist(args.id, args.topics);
}

export async function _updateWhitelist(id: number, topics: DeepPartial<Topic>[]): Promise<Topic[] | undefined> {
    try {
        const user: User | undefined = await _getUser(id);
        if (user === undefined) {
            return Promise.reject(undefined);
        }
        for (const topic of topics) {
            await _createTopic({ name: topic.name });
        }

        user.whitelist = await _newTopicList(
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
function updateBlacklist(parent: any, args: IUpdateWhitelist, ctx: any, info: GraphQLResolveInfo): Promise<Topic[] | undefined> {
    return _updateBlacklist(args.id, args.topics);
}

export async function _updateBlacklist(id: number, topics: DeepPartial<Topic>[]): Promise<Topic[] | undefined> {
    try {
        const user: User | undefined = await _getUser(id);
        if (user === undefined) {
            return Promise.reject(undefined);
        }
        for (const topic of topics) {
            await _createTopic({ name: topic.name });
        }

        user.blacklist = await _newTopicList(
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

async function _newTopicList(toggleTopics: (string | undefined)[], userTopics: (string | undefined)[]): Promise<Topic[]> {
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
    const newTopicList: Topic[] = [];
    for (const name of newTopicNames) {
        const topic: Topic | undefined = await _getTopic(undefined, name);
        if (topic) {
            newTopicList.push(topic);
        }
    }

    return newTopicList;
}

export const resolvers: IResolvers = {
    Mutation: {
        createUser,
        updateUser,
        updateWhitelist,
        updateBlacklist,
    },
    Query: {
        getUser,
    },
};
