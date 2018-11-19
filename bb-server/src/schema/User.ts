// TODO: Find and seperate out newTagList, newTopicList, etc. to generic function
import { Context } from "apollo-server-core";
import { gql, IResolvers } from "apollo-server-express";
import { DocumentNode, GraphQLResolveInfo } from "graphql";
import { DeepPartial } from "typeorm";
import { IAppContext } from "../App";
import Tag from "../entities/Tag";
import Topic from "../entities/Topic";
import User from "../entities/User";
import { createTag, getTag } from "./Tag";
import { createTopic, getTopic } from "./Topic";

export const typeDef: DocumentNode = gql`
    extend type Mutation {
        createUser(input: CreateUserInput!): User
        updateUser(input: UpdateUserInput!): User
        updateWhitelist(userId: Int!, topics: [CreateTopicInput]!): [Topic]
        updateBlacklist(userId: Int!, topics: [CreateTopicInput]!): [Topic]
		updateFavoriteTags(userId: Int!, tags: [CreateTagInput]!): [Tag]
        favoriteAUser(subjectId: Int!, actorId: Int!): User
    }

    extend type Query {
        getUser(id: Int!): User
    }

    type User {
        id: Int!
        firstName: String!
        lastName: String!
        imagePath: String!
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
        imagePath: String!
        about: String
        email: String!
        phoneNumber: String!
    }

    input UpdateUserInput {
        id: Int!
        imagePath: String
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
	return createUser(ctx, args.input);
}

export async function createUser(ctx: Context<IAppContext>, newUser: DeepPartial<User>): Promise<DeepPartial<User> | undefined> {
	try {
		// TODO: Get oAuthSub from context
		if (ctx.user === undefined) {
			Promise.reject(undefined);
		}
		newUser.oAuthSub = ctx.user.sub;
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
	return updateUser(ctx, args.input);
}

export async function updateUser(ctx: Context<IAppContext>, input: DeepPartial<User>): Promise<User | undefined> {
	if (input.id === undefined) {
		return Promise.resolve(undefined);
	}

	try {
		// TODO: Need to verify id with JWT from context
		const user: User | undefined = await ctx.connection.getRepository(User).save({
			...getUser(ctx, input.id),
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
	return updateWhitelist(ctx, args.userId, args.topics);
}

export async function updateWhitelist(ctx: Context<IAppContext>, id: number, topics: DeepPartial<Topic>[]): Promise<Topic[] | undefined> {
	try {
		const user: User | undefined = await getUser(ctx, id);
		if (user === undefined) {
			return Promise.resolve(undefined);
		}
		// TODO: Need to verify id with JWT from context
		for (const topic of topics) {
			await createTopic(ctx, { name: topic.name });
		}

		user.whitelist = await newTopicList(
			ctx,
			await topics.map(topic => topic.name),
			await user.whitelist.map(topic => topic.name)
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
		const user: User | undefined = await getUser(ctx, id);
		if (user === undefined) {
			return Promise.resolve(undefined);
		}
		// TODO: Need to verify id with JWT from context
		for (const topic of topics) {
			await createTopic(ctx, { name: topic.name });
		}

		user.blacklist = await newTopicList(
			ctx,
			await topics.map(topic => topic.name),
			await user.blacklist.map(topic => topic.name)
		);
		ctx.connection.getRepository(User).save(user);

		return user.blacklist;
	} catch (reason) {
		console.log(reason);
		return Promise.reject(undefined);
	}
}

async function newTopicList(ctx: Context<IAppContext>, toggleTopics: (string | undefined)[], userTopics: (string | undefined)[]): Promise<Topic[]> {
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
		const topic: Topic | undefined = await getTopic(ctx, { name: newName });
		if (topic !== undefined) {
			newList.push(topic);
		}
	}

	return newList;
}

interface IUpdateFavoriteTags {
	userId: number;
	tags: DeepPartial<Tag>[];
}

// tslint:disable-next-line:no-any
function _updateFavoriteTags(parent: any, args: IUpdateFavoriteTags, ctx: Context<IAppContext>, info: GraphQLResolveInfo): Promise<Topic[] | undefined> {
	return updateFavoriteTags(ctx, args.userId, args.tags);
}

export async function updateFavoriteTags(ctx: Context<IAppContext>, userId: number, tags: DeepPartial<Tag>[]): Promise<Tag[] | undefined> {
	try {
		const user: User | undefined = await getUser(ctx, userId);
		if (user === undefined) {
			return Promise.resolve(undefined);
		}
		// TODO: Need to verify id with JWT from context
		for (const tag of tags) {
			await createTag(ctx, { name: tag.name });
		}

		user.favoriteTags = await newTagList(
			ctx,
			await tags.map(tag => tag.name),
			await user.favoriteTags.map(tag => tag.name)
		);
		ctx.connection.getRepository(Tag).save(user);

		return user.favoriteTags;
	} catch (reason) {
		console.log(reason);
		return Promise.reject(undefined);
	}
}

async function newTagList(ctx: Context<IAppContext>, toggleTags: (string | undefined)[], userFavoriteTags: (string | undefined)[]): Promise<Tag[]> {
	const namesRemoved: (string | undefined)[] = [];
	for (const name of userFavoriteTags) {
		const index: number = toggleTags.indexOf(name);
		if (index >= 0) {
			await toggleTags.splice(index, 1);
			namesRemoved.push(name);
		}
	}
	for (const name of namesRemoved) {
		await userFavoriteTags.splice(
			userFavoriteTags.indexOf(name), 1
		);
	}

	const newTagNames: (string | undefined)[] = [...toggleTags, ...userFavoriteTags];
	const newList: Tag[] = [];
	for (const newName of newTagNames) {
		const tag: Tag | undefined = await getTag(ctx, { name: newName });
		if (tag !== undefined) {
			newList.push(tag);
		}
	}

	return newList;
}

interface IMakeFavoriteUser {
	subjectId: number;
	actorId: number;
}

// tslint:disable-next-line: no-any
function _favoriteAUser(parent: any, args: IMakeFavoriteUser, ctx: Context<IAppContext>, info: GraphQLResolveInfo): Promise<User | undefined> {
	return favoriteAUser(ctx, args.subjectId, args.actorId);
}

export async function favoriteAUser(ctx: Context<IAppContext>, subjectId: number, actorId: number): Promise<User | undefined> {
	let user: User | undefined = await getUser(ctx, actorId);
	const subject: User | undefined = await getUser(ctx, subjectId);
	if (user === undefined) {
		return Promise.resolve(undefined);
	}
	if (subject === undefined) {
		return Promise.resolve(undefined);
	}
	user.favoriteUsers.push(subject);
	user = await updateUser(ctx, user);    // User verification from ctx done here
	if (user === undefined) {
		Promise.resolve(undefined);
	}

	subject.timesFavorited += 1;
	return ctx.connection.getRepository(User).save({
		...getUser(ctx, subjectId),
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
	return getUser(ctx, args.id);
}

export async function getUser(ctx: Context<IAppContext>, userId: number): Promise<User | undefined> {
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
		updateFavoriteTags: _updateFavoriteTags,
		favoriteAUser: _favoriteAUser,
	},
	Query: {
		getUser: _getUser,
	},
};
