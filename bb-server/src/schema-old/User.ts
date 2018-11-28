// TODO: Find and seperate out newTagList, newTopicList, etc. to generic function
import { gql, IResolvers } from "apollo-server";
import { Context } from "apollo-server-core";
import { DocumentNode, GraphQLResolveInfo } from "graphql";
import { DeepPartial } from "typeorm";
import { IAppContext } from "../App";
import Meal from "../entities/Meal";
import Recipe from "../entities/Recipe";
import Tag from "../entities/Tag";
import Topic from "../entities/Topic";
import User from "../entities/User";
import { getUpcomingMeals } from "./Meal";
import { getRecipe, updateRecipe } from "./Recipe";
import { createTag, getTag } from "./Tag";
import { createTopic, getTopic } from "./Topic";

export const typeDef: DocumentNode = gql`
    extend type Mutation {
        createUser(input: CreateUserInput!): User
        updateUser(input: UpdateUserInput!): User
        updateWhitelist(userID: Int!, topics: [GetTopicInput]!): User
        updateBlacklist(userID: Int!, topics: [GetTopicInput]!): User
		updateFollowedTags(userID: Int!, tags: [GetTagInput]!): User
        toggleFollowedUser(userID: Int!): User
		toggleSavedRecipe(recipeID: Int!, userID: Int!): User
    }

    extend type Query {
        getUser(id: Int!): User
    }

    type User {
        id: Int!
        firstName: String!
        lastName: String!
        imagePath: String
        about: String!
        email: String!
		phoneNumber: String!
        createdAt: DateTime!
		hostedMeals: [Meal]
		mealsAttending: [Meal]	# NOTE: Anything that could be cyclical should not be required (this limits depth to 1)
		upcomingMeals: [Meal]
		whitelist: [Topic]!
        blacklist: [Topic]!
		savedRecipes: [Recipe]!  # NOTE: Should not be able to save if you are author of the recipe
		followedUsers: [User]  # NOTE: Should not be able to follow yourself
		followers: [User]
		followedTags: [Tag]!
        reviews: [UserReview]
		userReviewsAuthored: [UserReview]
		recipesAuthored: [Recipe]
		recipeReviewsAuthored: [RecipeReview]
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

export const resolvers: IResolvers = {
	Mutation: {
		createUser: _createUser,
		updateUser: _updateUser,
		updateWhitelist: _updateWhitelist,
		updateBlacklist: _updateBlacklist,
		updateFollowedTags: _updateFollowedTags,
		toggleFollowedUser: _toggleFollowedUser,
		toggleSavedRecipe: _toggleSavedRecipe,
	},
	Query: {
		getUser: _getUser,
	},
};

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
		// if (ctx.user === undefined) {
		// 	Promise.reject(undefined);
		// }
		// newUser.oAuthSub = ctx.user.sub;

		// TODO: Should do light email verification before sending verification email

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
	userID: number;	// TODO: get from context
	topics: DeepPartial<Topic>[];
}

// tslint:disable-next-line: no-any
function _updateWhitelist(parent: any, args: IUpdateWhitelist, ctx: Context<IAppContext>, info: GraphQLResolveInfo): Promise<User | undefined> {
	return updateWhitelist(ctx, args.userID, args.topics);
}

export async function updateWhitelist(ctx: Context<IAppContext>, id: number, topics: DeepPartial<Topic>[]): Promise<User | undefined> {
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
		return ctx.connection.getRepository(User).save(user);
	} catch (reason) {
		console.log(reason);
		return Promise.reject(undefined);
	}
}

// tslint:disable-next-line: no-any
function _updateBlacklist(parent: any, args: IUpdateWhitelist, ctx: Context<IAppContext>, info: GraphQLResolveInfo): Promise<User | undefined> {
	return updateBlacklist(args.userID, args.topics, ctx);
}

export async function updateBlacklist(id: number, topics: DeepPartial<Topic>[], ctx: Context<IAppContext>): Promise<User | undefined> {
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
		return ctx.connection.getRepository(User).save(user);
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

interface IUpdateSavedTags {
	userID: number; // TODO: get from context
	tags: DeepPartial<Tag>[];
}

// tslint:disable-next-line:no-any
function _updateFollowedTags(parent: any, args: IUpdateSavedTags, ctx: Context<IAppContext>, info: GraphQLResolveInfo): Promise<User | undefined> {
	return updateFollowedTags(ctx, args.userID, args.tags);
}

export async function updateFollowedTags(ctx: Context<IAppContext>, userID: number, tags: DeepPartial<Tag>[]): Promise<User | undefined> {
	try {
		const user: User | undefined = await getUser(ctx, userID);
		if (user === undefined) {
			return Promise.resolve(undefined);
		}
		// TODO: Need to verify id with JWT from context
		for (const tag of tags) {
			await createTag(ctx, { name: tag.name });
		}

		user.followedTags = await newTagList(
			ctx,
			await tags.map(tag => tag.name),
			await user.followedTags.map(tag => tag.name)
		);
		return ctx.connection.getRepository(Tag).save(user);
	} catch (reason) {
		console.log(reason);
		return Promise.reject(undefined);
	}
}

async function newTagList(ctx: Context<IAppContext>, toggleTags: (string | undefined)[], userSavedTags: (string | undefined)[]): Promise<Tag[]> {
	const namesRemoved: (string | undefined)[] = [];
	for (const name of userSavedTags) {
		const index: number = toggleTags.indexOf(name);
		if (index >= 0) {
			await toggleTags.splice(index, 1);
			namesRemoved.push(name);
		}
	}
	for (const name of namesRemoved) {
		await userSavedTags.splice(
			userSavedTags.indexOf(name), 1
		);
	}

	const newTagNames: (string | undefined)[] = [...toggleTags, ...userSavedTags];
	const newList: Tag[] = [];
	for (const newName of newTagNames) {
		const tag: Tag | undefined = await getTag(ctx, { name: newName });
		if (tag !== undefined) {
			newList.push(tag);
		}
	}

	return newList;
}

interface IToggleFollowedUser {
	userID: number;
}

// tslint:disable-next-line: no-any
function _toggleFollowedUser(parent: any, args: IToggleFollowedUser, ctx: Context<IAppContext>, info: GraphQLResolveInfo): Promise<User | undefined> {
	return toggleFollowedUser(ctx, args.userID);
}

export async function toggleFollowedUser(ctx: Context<IAppContext>, userID: number): Promise<User | undefined> {
	const subject: User | undefined = await getUserSpecifiedRelations(ctx, userID);
	const user: User | undefined = await ctx.user;
	if (user === undefined || subject === undefined) {
		return Promise.resolve(undefined);
	}

	const followedUserIDs: number[] = user.followedUsers.map(a => a.id);
	if (followedUserIDs.includes(userID)) {
		const index: number = followedUserIDs.indexOf(userID);
		user.followedUsers.splice(index, 1);
	} else {
		user.followedUsers.push(subject);
	}

	updateUser(ctx, user);
	return Promise.resolve(subject);
}

interface IToggleSavedRecipe {
	recipeID: number;
	userID: number;  // TODO: Get this from context when auth works
}

// tslint:disable-next-line: no-any
function _toggleSavedRecipe(parent: any, args: IToggleSavedRecipe, ctx: Context<IAppContext>, info: GraphQLResolveInfo): Promise<User | undefined> {
	return toggleSavedRecipe(ctx, args.recipeID, args.userID);
}

export async function toggleSavedRecipe(ctx: Context<IAppContext>, recipeID: number, userID: number): Promise<User | undefined> {
	const user: User | undefined = await getUser(ctx, userID);
	const recipe: Recipe | undefined = await getRecipe(ctx, { id: recipeID });
	if (user === undefined) {
		return Promise.resolve(undefined);
	}
	if (recipe === undefined) {
		return Promise.resolve(undefined);
	}

	const savedRecipeIDs: number[] = user.savedRecipes.map(a => a.id);
	if (savedRecipeIDs.includes(recipeID)) {
		const index: number = savedRecipeIDs.indexOf(recipeID);
		user.savedRecipes.splice(index, 1);
		recipe.timesSaved -= 1;
	} else {
		user.savedRecipes.push(recipe);
		recipe.timesSaved += 1;
	}

	updateRecipe(ctx, recipe);
	return updateUser(ctx, user);    // User verification from ctx done here
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

export async function getUser(ctx: Context<IAppContext>, userID: number): Promise<User | undefined> {
	const neededRelations: string[] = [
		"hostedMeals", "mealsAttending", "reviews", "userReviewsAuthored", "recipeReviewsAuthored",
		"savedRecipes", "followedUsers", "followers", "recipesAuthored", "followedTags",
	];

	const user: User | undefined = await ctx.connection
		.getRepository(User)
		.findOne({
			where: {
				id: userID,
			},
			relations: neededRelations,
		});
	if (user === undefined) {
		return Promise.resolve(undefined);
	}

	const upcomingMealsPromise: Promise<Meal[] | undefined> = getUpcomingMeals(ctx, user.mealsAttending.map(meal => meal.id));
	const upcomingMeals: Meal[] | undefined = await upcomingMealsPromise;

	if (upcomingMeals === undefined) {
		return Promise.resolve(undefined);
	}
	return Promise.resolve({
		...user,
		upcomingMeals,
	});
}

export async function getUserSpecifiedRelations(
	ctx: Context<IAppContext>, userID: number, relations: string[] = []
): Promise<User | undefined> {
	return ctx.connection
		.getRepository(User)
		.findOne({
			where: {
				id: userID,
			},
			relations,
		});
}
