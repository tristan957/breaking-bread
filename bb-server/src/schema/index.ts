import { gql, IResolvers } from "apollo-server-express";
import { DocumentNode } from "graphql";
import GraphQLDateTime from "graphql-iso-date";
import merge from "lodash.merge";
import { resolvers as allergyResolvers, typeDef as Allergy } from "./Allergy";
import { resolvers as ingredientResolvers, typeDef as Ingredient } from "./Ingredient";
import { resolvers as mealResolvers, typeDef as Meal } from "./Meal";
import { resolvers as recipeResolvers, typeDef as Recipe } from "./Recipe";
import { resolvers as recipeReviewResolvers, typeDef as RecipeReview } from "./RecipeReview";
import { resolvers as tagResolvers, typeDef as Tag } from "./Tag";
import { resolvers as topicResolvers, typeDef as Topic } from "./Topic";
import { resolvers as userResolvers, typeDef as User } from "./User";
import { resolvers as userReviewResolvers, typeDef as UserReview } from "./UserReview";

// tslint:disable-next-line: variable-name
const Query: DocumentNode = gql`
    scalar DateTime

    type Query {
        _: String
    }
`;

const scalarResolvers: IResolvers = {
    DateTime: GraphQLDateTime,
};

export const typeDefs: DocumentNode[] = [
    Allergy, Meal, Query,
    User, Topic, Tag, Recipe,
    UserReview, RecipeReview, Ingredient,
];

// tslint:disable-next-line: no-unsafe-any
export const resolvers: IResolvers = merge(
    scalarResolvers,
    allergyResolvers, mealResolvers, userResolvers,
    topicResolvers, tagResolvers, recipeResolvers,
    userReviewResolvers, recipeReviewResolvers, ingredientResolvers
);
