import { gql, IResolvers } from "apollo-server";
import { DocumentNode } from "graphql";
import merge from "lodash.merge";
import { resolvers as allergyResolvers, typeDef as Allergy } from "./Allergy";
import { resolvers as dateResolvers, typeDef as DateTime } from "./DateTime";
import { resolvers as getLoggedInUserResolvers, typeDef as LoggedInUser } from "./LoggedInUser";
import { resolvers as mealResolvers, typeDef as Meal } from "./Meal";
import { resolvers as mealFeedResolvers, typeDef as MealFeed } from "./MealFeed";
import { resolvers as recipeResolvers, typeDef as Recipe } from "./Recipe";
import { resolvers as recipeReviewResolvers, typeDef as RecipeReview } from "./RecipeReview";
import { resolvers as tagResolvers, typeDef as Tag } from "./Tag";
import { resolvers as topicResolvers, typeDef as Topic } from "./Topic";
import { resolvers as userResolvers, typeDef as User } from "./User";
import { resolvers as userReviewResolvers, typeDef as UserReview } from "./UserReview";

// tslint:disable-next-line: variable-name
const Mutation: DocumentNode = gql`
    type Mutation {
        _: String
    }
`;

// tslint:disable-next-line: variable-name
const Query: DocumentNode = gql`
    type Query {
        _: String
    }
`;

export const typeDefs: DocumentNode[] = [
	Allergy, DateTime, Meal, Mutation, Query,
	User, Topic, Tag, Recipe,
	UserReview, RecipeReview, MealFeed, LoggedInUser,
];

// tslint:disable-next-line: no-unsafe-any
export const resolvers: IResolvers = merge(
	allergyResolvers, dateResolvers, mealResolvers, userResolvers,
	topicResolvers, tagResolvers, recipeResolvers,
	userReviewResolvers, recipeReviewResolvers, mealFeedResolvers,
	getLoggedInUserResolvers
);
