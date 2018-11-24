import { gql, IResolvers } from "apollo-server";
import { Context } from "apollo-server-core";
import { DocumentNode, GraphQLResolveInfo } from "graphql";
import { DeepPartial, MoreThan, Not } from "typeorm";
import { IAppContext } from "../App";
import Meal from "../entities/Meal";
import Tag from "../entities/Tag";
import Topic from "../entities/Topic";
import filterByChildren from "./genericHelpers/filterByChildren";
import generatePagination from "./genericHelpers/paginatedFeed";
import { getTag } from "./Tag";
import { getTopic } from "./Topic";

export const typeDef: DocumentNode = gql`
	extend type Query {
		getMealFeed(filterOptions: GetMealFeedOptions, first: Int!, after: String): MealFeed  # first: Amount to return, after: return this cursor and up to amount
	}

	type MealFeed {
		edges: [MealEdge]!
		pageInfo: PageInfo!
		totalCount: Int!
	}

	type MealEdge {
		node: Meal!
		cursor: String!
	}

	type PageInfo {
		endCursor: String!
		hasNextPage: Boolean!
	}

	input GetMealFeedOptions {
		location: LocationFilter
		maxGuests: Int
		tags: [GetTagInput]
		topics: [GetTopicInput]
	}

	input LocationFilter {
		distanceMI: Int!
		fromLocation: String!	# Either an address or a lat and lon
	}
`;

export const resolvers: IResolvers = {
	Query: {
		getMealFeed: _getMealFeed,
	},
};

interface IMealEdge {
	node: Meal;
	cursor: string;
}

interface IPageInfo {
	endCursor: string;
	hasNextPage: boolean;
}

interface IMealFeed {
	edges: IMealEdge[];
	pageInfo: IPageInfo;
	totalCount: number;
}

interface ILocationOptions {
	distanceMI: number;
	locationFrom: string;
}

interface IGetMealFeedOptions {
	location?: ILocationOptions;
	maxGuests?: number;
	tags?: DeepPartial<Tag>[];
	topics?: DeepPartial<Topic>[];
}

interface IGetMealFeed {
	filterOptions?: IGetMealFeedOptions;
	first: number;
	after?: string;
}

// tslint:disable-next-line: no-any
function _getMealFeed(parent: any, args: IGetMealFeed, ctx: Context<IAppContext>, info: GraphQLResolveInfo): Promise<IMealFeed | undefined> {
	return getMealFeed(ctx, args.first, args.filterOptions, args.after);
}

async function getMealFeed(ctx: Context<IAppContext>, first: number, filterOptions?: IGetMealFeedOptions, after?: string): Promise<IMealFeed | undefined> {
	if (first < 1) {
		return Promise.resolve(undefined);
	}

	// Max Guest filtering
	let where: {} = {};
	if (filterOptions !== undefined && filterOptions.maxGuests !== undefined) {
		where = {
			maxGuests: Not(MoreThan(filterOptions.maxGuests)),
		};
	}

	// Getting all meals
	let meals: Meal[] = await ctx.connection
		.getRepository(Meal)
		.find({
			where: {
				...where,
				startTime: MoreThan(new Date(new Date().getTime() + 60 * 60000)),  // Now +60 minutes  TODO: Date filtering
			},
			relations: ["host", "guests", "recipes"],
		});
	if (meals.length === 0) {
		return Promise.resolve(undefined);
	}

	// Filtering
	meals = filterFilledMeals(meals);
	if (filterOptions !== undefined && filterOptions.tags !== undefined) {
		meals = await filterByChildren(ctx, meals, filterOptions.tags, getTag, getMealRecipeTags);
	}
	if (filterOptions !== undefined && filterOptions.topics !== undefined) {
		meals = await filterByChildren(ctx, meals, filterOptions.topics, getTopic, getMealHostTopics);
	}

	return Promise.resolve(
		generatePagination(meals, JSON.stringify([{}, filterOptions]), first, after)
	);
}

function filterFilledMeals(meals: Meal[]): Meal[] {
	const filteredMeals: Meal[] = [];

	for (const meal of meals) {
		const open: boolean = mealHasSeatsOpen(meal);
		if (open) {
			filteredMeals.push(meal);
		}
	}

	return filteredMeals;
}

function mealHasSeatsOpen(meal: Meal): boolean {
	return meal.guests.length < meal.maxGuests;
}

function getMealRecipeTags(meal: Meal): Tag[] {
	return meal.recipes.flatMap(recipe => recipe.tags);
}

function getMealHostTopics(meal: Meal): Topic[] {
	return meal.host.whitelist;
}
