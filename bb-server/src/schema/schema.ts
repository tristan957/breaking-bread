import { gql, IResolvers } from "apollo-server-express";
import { DocumentNode } from "graphql";
import merge from "lodash.merge";
import { resolvers as mealResolvers, typeDef as Meal } from "./Meal";
import { resolvers as reviewResolvers, typeDef as Review } from "./Review";
// import {
//     typeDef as Recipe,
//     resolvers as recipeResolvers
// } from "./Recipe";
// import {
//     typeDef as Tag,
//     resolvers as tagResolvers
// } from "./Tag";
import { resolvers as topicResolvers, typeDef as Topic } from "./Topic";
import { resolvers as userResolvers, typeDef as User } from "./User";

// tslint:disable-next-line:variable-name
const Query: DocumentNode = gql`
    type Query {
        _: String
    }
`;

export const typeDefs: DocumentNode[] = [Meal, Query, User, Topic, Review];
export const resolvers: IResolvers = merge(mealResolvers, userResolvers, topicResolvers, reviewResolvers);
