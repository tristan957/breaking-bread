import AllergyController from "./AllergyController";
import MealController from "./MealController";
import RecipeController from "./RecipeController";
import TagController from "./TagController";
import TopicController from "./TopicController";
import UserController from "./UserController";

export { default as AllergyController } from "./AllergyController";
export { default as MealController } from "./MealController";
export { default as RecipeController } from "./RecipeController";
export { default as TagController } from "./TagController";
export { default as TopicController } from "./TopicController";
export { default as UserController } from "./UserController";

const controllers: Function[] = [
	AllergyController,
	MealController,
	RecipeController,
	TagController,
	TopicController,
	UserController,
];

export default controllers;
