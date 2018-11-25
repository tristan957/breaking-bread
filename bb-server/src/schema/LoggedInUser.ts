import { gql, IResolvers } from "apollo-server";
import { Context } from "apollo-server-core";
import { DocumentNode, GraphQLResolveInfo } from "graphql";
import { IAppContext } from "../App";
import User from "../entities/User";

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
function _getLoggedInUser(parent: any, args: any, ctx: Context<IAppContext>, info: GraphQLResolveInfo): Promise<User | undefined> {
	return ctx.user;
}
