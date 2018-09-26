import { gql, IResolvers } from "apollo-server-express";
import { DocumentNode } from "graphql";
import merge from "lodash.merge";
import { resolvers as mealResolvers, typeDef as Meal } from "./Meal";
// import {
//     typeDef as Recipe,
//     resolvers as recipeResolvers
// } from "./Recipe";
// import {
//     typeDef as Review,
//     resolvers as reviewResolvers
// } from "./Review";
// import {
//     typeDef as Tag,
//     resolvers as tagResolvers
// } from "./Tag";
// import {
//     typeDef as Topic,
//     resolvers as topicResolvers
// } from "./Topic";
import { resolvers as userResolvers, typeDef as User } from "./User";

// tslint:disable-next-line:variable-name
const Query: DocumentNode = gql`
    type Query {
        _: String
    }
`;

export const typeDefs: DocumentNode[] = [Meal, Query, User];
export const resolvers: IResolvers = merge(mealResolvers, userResolvers);
