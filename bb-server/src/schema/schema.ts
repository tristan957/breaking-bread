import { gql, IResolvers } from "apollo-server-express";
import { DocumentNode } from "graphql";
import merge from "lodash.merge";
import { resolvers as allergenResolvers, typeDef as Allergen } from "./Allergen";
import { resolvers as ingredientResolvers, typeDef as Ingredient } from "./Ingredient";
import { resolvers as mealResolvers, typeDef as Meal } from "./Meal";
import { resolvers as recipeResolvers, typeDef as Recipe } from "./Recipe";
import { resolvers as recipeReviewResolvers, typeDef as RecipeReview } from "./RecipeReview";
import { resolvers as tagResolvers, typeDef as Tag } from "./Tag";
import { resolvers as topicResolvers, typeDef as Topic } from "./Topic";
import { resolvers as userResolvers, typeDef as User } from "./User";
import { resolvers as userReviewResolvers, typeDef as UserReview } from "./UserReview";

// tslint:disable-next-line:variable-name
const Query: DocumentNode = gql`
    type Query {
        _: String
    }
`;

export const typeDefs: DocumentNode[] = [
    Allergen, Meal, Query,
    User, Topic, Tag, Recipe,
    UserReview, RecipeReview, Ingredient,
];

export const resolvers: IResolvers = merge(
    allergenResolvers, mealResolvers, userResolvers,
    topicResolvers, tagResolvers, recipeResolvers,
    userReviewResolvers, recipeReviewResolvers, ingredientResolvers
);
