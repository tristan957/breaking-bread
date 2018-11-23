import { Context } from "apollo-server-core";
import { gql, IResolvers } from "apollo-server-express";
import { DocumentNode, GraphQLResolveInfo } from "graphql";
import { MoreThan, Not } from "typeorm";
import { IAppContext } from "../App";
import Meal from "../entities/Meal";
import Tag from "../entities/Tag";
import generatePagination from "./genericHelpers/paginatedFeed";

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
		# location: LocationFilter
		maxGuests: Int
		tags: [GetTagInput]
	}

	input LocationFilter {
		distanceMI: Int!
		fromLocation: String!
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
	// location?: ILocationOptions;
	maxGuests?: number;
	tags?: Tag[];
}

interface IGetMealFeed {
	filterOptions?: IGetMealFeedOptions;
	first: number;
	after?: string;
}

// tslint:disable-next-line: no-any
function _getMealFeed(parent: any, args: IGetMealFeed, ctx: Context<IAppContext>, info: GraphQLResolveInfo): Promise<IMealFeed | undefined> {
	return getMealFeed(ctx, args.filterOptions, args.first, args.after);
}

async function getMealFeed(ctx: Context<IAppContext>, filterOptions: IGetMealFeedOptions | undefined, first: number, after: string | undefined): Promise<IMealFeed | undefined> {
	if (first < 1) {
		return Promise.resolve(undefined);
	}

	// Max Guest filtering
	let where: {} = {};
	if (filterOptions !== undefined) {
		where = {
			maxGuests: Not(MoreThan(filterOptions.maxGuests)),
		};
	}

	const meals: Meal[] = await ctx.connection
		.getRepository(Meal)
		.find({
			where,
			relations: ["host", "guests", "recipes"],
		});
	if (meals.length === 0) {
		return Promise.resolve(undefined);
	}
	// TODO: Splice where no spots are remaining

	// Tags filtering
	// TODO: Collect tags from recipes

	return Promise.resolve(generatePagination(meals, first, after));
}
