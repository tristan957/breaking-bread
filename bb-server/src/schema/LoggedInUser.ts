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

	const upcomingMeals: Meal[] | undefined = await getUpcomingMeals(ctx, user.mealsAttending.map(meal => meal.id));
	if (upcomingMeals === undefined) {
		return undefined;
	}

	return Promise.resolve({
		...user,
		upcomingMeals,
	});
}
