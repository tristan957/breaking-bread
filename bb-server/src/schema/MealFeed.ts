import { Context } from "apollo-server-core";
import { gql, IResolvers } from "apollo-server-express";
import * as CRC32 from "crc-32";
import { DocumentNode, GraphQLResolveInfo } from "graphql";
import { IAppContext } from "../App";
import Meal from "../entities/Meal";
import Tag from "../entities/Tag";

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
	return Promise.resolve(generateMealFeed(meals, first, after));
}

function generateMealFeed(meals: Meal[], first: number, after: string | undefined): IMealFeed | undefined {
	const cursors: string[] = [];
	let edges: IMealEdge[] = meals.map((meal: Meal, i: number) => {
		const cursor: string = CRC32.str(`${i}${meal.createdAt.toString()}`).toString();  // Unique cursor generation
		cursors.push(cursor);
		return ({
			node: meal,
			cursor,
		});
	});

	let index = 0;
	if (after !== undefined) {
		index = cursors.indexOf(after);
		if (index < 0) {
			return undefined;
		}
	}

	let getAmount: number = first;
	let hasNextPage = true;
	if ((meals.length - index) <= first) {
		getAmount = edges.length - index;
		hasNextPage = false;
	}

	edges = edges.splice(index, getAmount);
	return {
		edges,
		pageInfo: {
			endCursor: edges[edges.length - 1].cursor,
			hasNextPage,
		},
		totalCount: meals.length,
	};
}
