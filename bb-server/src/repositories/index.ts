import AllergyRepository from "./AllergyRepository";
import MealRepository from "./MealRepository";
import RecipeReviewRepository from "./RecipeReviewRepository";
import TagRepository from "./TagRepository";
import TopicRepository from "./TopicRepository";
import UserRepository from "./UserRepository";
import UserReviewRepository from "./UserReviewRepository";

export { default as AllergyRepository } from "./AllergyRepository";
export { default as MealRepository } from "./MealRepository";
export { default as RecipeRepository } from "./RecipeRepository";
export { default as RecipeReviewRepository } from "./RecipeReviewRepository";
export { default as TagRepository } from "./TagRepository";
export { default as TopicRepository } from "./TopicRepository";
export { default as UserRepository } from "./UserRepository";
export { default as UserReviewRepository } from "./UserReviewRepository";

const repositories: Function[] = [
	AllergyRepository,
	MealRepository,
	RecipeReviewRepository,
	TagRepository,
	TopicRepository,
	UserRepository,
	UserReviewRepository,
];

export default repositories;
