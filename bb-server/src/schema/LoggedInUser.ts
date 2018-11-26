import { gql, IResolvers } from "apollo-server";
import { Context } from "apollo-server-core";
import { DocumentNode, GraphQLResolveInfo } from "graphql";
import { IAppContext } from "../App";
import Meal from "../entities/Meal";
import User from "../entities/User";
import { getUpcomingMeals } from "./Meal";

export const typeDef: DocumentNode = gql`
    extend type Query {
        getLoggedInUser: User
    }
`;

export const resolvers: IResolvers = {
	Query: {
		getLoggedInUser: _getLoggedInUser,
	},
};

// tslint:disable-next-line: no-any
async function _getLoggedInUser(parent: any, args: any, ctx: Context<IAppContext>, info: GraphQLResolveInfo): Promise<User | undefined> {
	const user: User | undefined = await ctx.user;
	if (user === undefined) {
		return undefined;
	}

	const upcomingMealsPromise: Promise<Meal[] | undefined> = getUpcomingMeals(ctx, user.mealsAttending.map(meal => meal.id));
	const upcomingMeals: Meal[] | undefined = await upcomingMealsPromise;

	if (upcomingMeals === undefined) {
		return undefined;
	}
	return Promise.resolve({
		...user,
		upcomingMeals,
	});
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

	}

	retVal.sort((a: Meal, b: Meal): number => {
		return a.startTime.valueOf() - b.startTime.valueOf();
	});

	return Promise.resolve(retVal);
}
