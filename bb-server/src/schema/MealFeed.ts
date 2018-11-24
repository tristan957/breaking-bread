import { Context } from "apollo-server-core";
import { gql, IResolvers } from "apollo-server-express";
import { DocumentNode, GraphQLResolveInfo } from "graphql";
import { DeepPartial, MoreThan, Not } from "typeorm";
import { IAppContext } from "../App";
import Meal from "../entities/Meal";
import Tag from "../entities/Tag";
import includesEntity from "./genericHelpers/includesEntity";
import generatePagination from "./genericHelpers/paginatedFeed";
import { getTag } from "./Tag";

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
	tags?: DeepPartial<Tag>[];
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
	if (filterOptions !== undefined && filterOptions.maxGuests !== undefined) {
		where = {
			maxGuests: Not(MoreThan(filterOptions.maxGuests)),
		};
	}

	// Getting all meals
	let meals: Meal[] = await ctx.connection
		.getRepository(Meal)
		.find({
			where,
			relations: ["host", "guests", "recipes"],
		});
	if (meals.length === 0) {
		return Promise.resolve(undefined);
	}
	meals = filterFilledMeals(meals);  // NOTE: This might fuck up the pagination idea, as meals may fill up

	if (filterOptions !== undefined && filterOptions.tags !== undefined) {
		meals = await filterTags(ctx, meals, filterOptions.tags);
	}

	return Promise.resolve(generatePagination(meals, JSON.stringify([{}, filterOptions]), first, after));
}

function filterFilledMeals(meals: Meal[]): Meal[] {
	const filteredMeals: Meal[] = [];

	meals.forEach((meal: Meal) => {
		const open: Boolean | undefined = meal.seatsRemaining();
		if (open === undefined) {
			throw Error;  // Should be more elegant
		}
		if (open) {
			filteredMeals.push(meal);
		}
	});

	return filteredMeals;
}

async function filterTags(ctx: Context<IAppContext>, meals: Meal[], tagsReq: DeepPartial<Tag>[]): Promise<Meal[]> {
	const tags: Tag[] = [];
	for (const tag of tagsReq) {
		const tempTag: Tag | undefined = await getTag(ctx, tag, false);
		if (tempTag !== undefined) {
			tags.push(tempTag);
		}
	}

	const filteredMeals: Meal[] = [];
	if (tags.length > 0) {
		for (const meal of meals) {
			const mealTags: Tag[] | undefined = meal.getRecipeTags();
			if (mealTags === undefined) {
				return Promise.reject(meals); // Some issue with relations
			}

			// If mealtags has the requested tags add the meal to the filtered meals
			let add = true;
			for (const tag of tags) {
				if (!includesEntity(mealTags, tag)) {
					add = false;
				}
			}

			if (add) {
				filteredMeals.push(meal);
			}
		}
	} else {
		return Promise.reject(meals);  // Tags must have been invalid in how they were entered. Should consider throwing error
	}

	return Promise.resolve(filteredMeals);
}
