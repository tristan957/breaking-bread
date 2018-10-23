import { Context } from "apollo-server-core";
import { gql, IResolvers } from "apollo-server-express";
import { DocumentNode, GraphQLResolveInfo } from "graphql";
import { DeepPartial } from "typeorm";
import { IAppContext } from "../App";
import Topic from "../entities/Topic";
import User from "../entities/User";
import { createTopic, getTopic } from "./Topic";

export const typeDef: DocumentNode = gql`
    extend type Mutation {
        createUser(input: CreateUserInput!): User
        updateUser(input: UpdateUserInput!): User
        updateWhitelist(userId: Int!, topics: [CreateTopicInput]!): [Topic]
        updateBlacklist(userId: Int!, topics: [CreateTopicInput]!): [Topic]
        favoriteAUser(subjectId: Int!, actorId: Int!): User
    }

    extend type Query {
        getUser(id: Int!): User
    }

    type User {
        id: Int!
        firstName: String!
        lastName: String!
        profilePictureS3Key: String!
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
        profilePictureS3Key: String!
        about: String
        email: String!
        phoneNumber: String!
    }

    input UpdateUserInput {
        id: Int!
        profilePictureS3Key: String
        about: String
        email: String
        phoneNumber: String
    }
`;

/**
 * Mutator Resolvers
 */

interface ICreateUser {
    input: DeepPartial<User>;
}

// tslint:disable-next-line: no-any
function _createUser(parent: any, args: ICreateUser, ctx: Context<IAppContext>, info: GraphQLResolveInfo): Promise<DeepPartial<User> | undefined> {
    return createUser(args.input, ctx);
}

export async function createUser(newUser: DeepPartial<User>, ctx: Context<IAppContext>): Promise<DeepPartial<User> | undefined> {
    try {
        // TODO: Get oAuthSub from context
        newUser.oAuthSub = await Date.now.toString();
        if (newUser.timesFavorited === undefined) {
            newUser.timesFavorited = 0;
        }

        const user: DeepPartial<User> = await ctx.connection.getRepository(User).save(newUser);
        return user;
    } catch (reason) {
        console.log(reason);
        return Promise.reject(undefined);
    }
}

interface IUpdateUser {
    input: DeepPartial<User>;
}

// tslint:disable-next-line: no-any
function _updateUser(parent: any, args: IUpdateUser, ctx: Context<IAppContext>, info: GraphQLResolveInfo): Promise<User | undefined> {
    return updateUser(args.input, ctx);
}

export async function updateUser(input: DeepPartial<User>, ctx: Context<IAppContext>): Promise<User | undefined> {
    if (input.id === undefined) {
        return Promise.resolve(undefined);
    }
    try {
        // TODO: Need to verify id with JWT from context
        const user: User | undefined = await ctx.connection.getRepository(User).save({
            ...getUser(input.id, ctx),
            ...input,
        });
        return user;
    } catch (reason) {
        console.log(reason);
        return Promise.reject(undefined);
    }
}

interface IUpdateWhitelist {
    userId: number;
    topics: DeepPartial<Topic>[];
}

// tslint:disable-next-line: no-any
function _updateWhitelist(parent: any, args: IUpdateWhitelist, ctx: Context<IAppContext>, info: GraphQLResolveInfo): Promise<Topic[] | undefined> {
    return updateWhitelist(args.userId, args.topics, ctx);
}

export async function updateWhitelist(id: number, topics: DeepPartial<Topic>[], ctx: Context<IAppContext>): Promise<Topic[] | undefined> {
    try {
        const user: User | undefined = await getUser(id, ctx);
        if (user === undefined) {
            return Promise.resolve(undefined);
        }
        // TODO: Need to verify id with JWT from context
        for (const topic of topics) {
            await createTopic({ name: topic.name }, ctx);
        }

        user.whitelist = await newTopicList(
            await topics.map(topic => topic.name),
            await user.whitelist.map(topic => topic.name),
            ctx
        );
        ctx.connection.getRepository(User).save(user);

        return user.whitelist;
    } catch (reason) {
        console.log(reason);
        return Promise.reject(undefined);
    }
}

// tslint:disable-next-line: no-any
function _updateBlacklist(parent: any, args: IUpdateWhitelist, ctx: Context<IAppContext>, info: GraphQLResolveInfo): Promise<Topic[] | undefined> {
    return updateBlacklist(args.userId, args.topics, ctx);
}

export async function updateBlacklist(id: number, topics: DeepPartial<Topic>[], ctx: Context<IAppContext>): Promise<Topic[] | undefined> {
    try {
        const user: User | undefined = await getUser(id, ctx);
        if (user === undefined) {
            return Promise.resolve(undefined);
        }
        // TODO: Need to verify id with JWT from context
        for (const topic of topics) {
            await createTopic({ name: topic.name }, ctx);
        }

        user.blacklist = await newTopicList(
            await topics.map(topic => topic.name),
            await user.blacklist.map(topic => topic.name),
            ctx
        );
        ctx.connection.getRepository(User).save(user);

        return user.blacklist;
    } catch (reason) {
        console.log(reason);
        return Promise.reject(undefined);
    }
}

async function newTopicList(toggleTopics: (string | undefined)[], userTopics: (string | undefined)[], ctx: Context<IAppContext>): Promise<Topic[]> {
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
    for (const newName of newTopicNames) {
        const topic: Topic | undefined = await getTopic({ name: newName }, ctx);
        if (topic !== undefined) {
            newList.push(topic);
        }
    }

    return newList;
}

interface IMakeFavoriteUser {
    recipeId: number;
    userId: number;
}

// tslint:disable-next-line: no-any
function _favoriteAUser(parent: any, args: IMakeFavoriteUser, ctx: Context<IAppContext>, info: GraphQLResolveInfo): Promise<User | undefined> {
    return favoriteAUser(args.recipeId, args.userId, ctx);
}

export async function favoriteAUser(subjectId: number, actorId: number, ctx: Context<IAppContext>): Promise<User | undefined> {
    let user: User | undefined = await getUser(actorId, ctx);
    const subject: User | undefined = await getUser(subjectId, ctx);
    if (user === undefined) {
        return Promise.resolve(undefined);
    }
    if (subject === undefined) {
        return Promise.resolve(undefined);
    }
    user.favoriteUsers.push(subject);
    user = await updateUser(user, ctx);    // User verification from ctx done here
    if (user === undefined) {
        Promise.resolve(undefined);
    }

    subject.timesFavorited += 1;
    return ctx.connection.getRepository(User).save({
        ...getUser(subjectId, ctx),
        ...subject,
    });
}

/**
 * Query Resolvers
 */

interface IGetUser {
    id: number;
}

// tslint:disable-next-line: no-any
function _getUser(parent: any, args: IGetUser, ctx: Context<IAppContext>, info: GraphQLResolveInfo): Promise<User | undefined> {
    return getUser(args.id, ctx);
}

export async function getUser(userId: number, ctx: Context<IAppContext>): Promise<User | undefined> {
    const neededRelations: string[] = [
        "hostedMeals", "whitelist", "blacklist",
        "reviews", "userReviewsAuthored", "recipeReviewsAuthored",
        "favoriteRecipes", "favoriteUsers", "recipesAuthored"];
    return ctx.connection
        .getRepository(User)
        .findOne({
            where: {
                id: userId,
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
        favoriteAUser: _favoriteAUser,
    },
    Query: {
        getUser: _getUser,
    },
};
