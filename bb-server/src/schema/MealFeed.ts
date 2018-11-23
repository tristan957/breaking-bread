import { Context } from "apollo-server-core";
import { gql, IResolvers } from "apollo-server-express";
import { DocumentNode, GraphQLResolveInfo } from "graphql";
import { IAppContext } from "../App";
import Meal from "../entities/Meal";
import Tag from "../entities/Tag";
import generatePagination from "./genericHelpers/paginatedFeed";

export const typeDef: DocumentNode = gql`
	extend type Query {
		getMealFeed(filterOptions: GetMealsFilterOptions, first: Int!, after: String): MealFeed  # first: Amount to return, after: return this cursor and up to amount
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

	input GetMealsFilterOptions {
		location: LocationFilter
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

interface IGetMealsOptions {
	location?: ILocationOptions;
	tags?: Tag[];
}

interface IGetMealFeed {
	options?: IGetMealsOptions;
	first: number;
	after?: string;
}

// tslint:disable-next-line: no-any
function _getMealFeed(parent: any, args: IGetMealFeed, ctx: Context<IAppContext>, info: GraphQLResolveInfo): Promise<IMealFeed | undefined> {
	return getMealFeed(ctx, args.options, args.first, args.after);
}

async function getMealFeed(ctx: Context<IAppContext>, options: IGetMealsOptions | undefined, first: number, after: string | undefined): Promise<IMealFeed | undefined> {
	if (first < 1) {
		return Promise.resolve(undefined);
	}

	const meals: Meal[] = await ctx.connection
		.getRepository(Meal)
		.find({
			relations: ["host", "guests"],
		});
	if (meals.length === 0) {
		return Promise.resolve(undefined);
	}
	// TODO: filter meals based on options
	return Promise.resolve(generatePagination(meals, first, after));
}
