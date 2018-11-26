import { gql, IResolvers } from "apollo-server";
import { Context } from "apollo-server-core";
import { DocumentNode, GraphQLResolveInfo } from "graphql";
import { IAppContext } from "../App";
import Meal from "../entities/Meal";
import User from "../entities/User";
import generatePagination from "./genericHelpers/paginatedFeed";
import { getUserSpecifiedRelations } from "./User";

export const typeDef: DocumentNode = gql`
	extend type Query {
		getHostedMealsFeed(hostID: Int!, first: Int!, after: String): MealFeed  # first: Amount to return, after: return this cursor and up to amount
	}
`;

export const resolvers: IResolvers = {
	Query: {
		getHostedMealsFeed: _getHostedMealsFeed,
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

interface IGetHostedMealsFeed {
	first: number;
	after?: string;
	hostID: number;
}

// tslint:disable-next-line: no-any
function _getHostedMealsFeed(parent: any, args: IGetHostedMealsFeed, ctx: Context<IAppContext>, info: GraphQLResolveInfo): Promise<IMealFeed | undefined> {
	return getHostedMealsFeed(ctx, args.first, args.hostID, args.after);
}

async function getHostedMealsFeed(ctx: Context<IAppContext>, first: number, hostID: number, after?: string): Promise<IMealFeed | undefined> {
	if (first < 1) {
		return Promise.resolve(undefined);
	}

	const user: User | undefined = await getUserSpecifiedRelations(ctx, hostID, ["hostedMeals"]);
	if (user === undefined) {
		return Promise.resolve(undefined);
	}

	const mealIDs: number[] = user.hostedMeals.map(meal => meal.id);
	const meals: Meal[] | undefined = await getMealsFromIDs(ctx, mealIDs);
	if (meals === undefined || meals.length === 0) {
		return Promise.resolve(undefined);
	}

	return Promise.resolve(
		generatePagination(meals, `${hostID}`, first, after)
	);
}

async function getMealsFromIDs(ctx: Context<IAppContext>, mealIDs: number[]): Promise<Meal[] | undefined> {
	const retVal: Meal[] = [];
	const neededRelations: string[] = [
		"host", "guests", "recipes",
	];

	for (const mealID of mealIDs) {
		const tempMeal: Meal | undefined = await ctx.connection
			.getRepository(Meal)
			.findOne({
				where: {
					id: mealID,
				},
				relations: neededRelations,
			});
		if (tempMeal === undefined) {
			return Promise.resolve(undefined);
		}
		retVal.push(tempMeal);
	}

	return Promise.resolve(retVal);
}
