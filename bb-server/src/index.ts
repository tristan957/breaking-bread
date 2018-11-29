import { GraphQLDateTime } from "graphql-iso-date";
import { bootstrap } from "vesper";
import controllers from "./controllers";
import { Allergy, entities, Meal, Recipe, RecipeReview, Tag, Topic, User, UserReview } from "./entities";
import { AllergyRepository, MealRepository, RecipeRepository, RecipeReviewRepository, TagRepository, TopicRepository, UserRepository, UserReviewRepository } from "./repositories";

bootstrap({
	port: 10262,
	controllers,
	entityRepositories: [
		{
			repository: AllergyRepository,
			entity: Allergy,
		},
		{
			repository: MealRepository,
			entity: Meal,
		},
		{
			repository: RecipeRepository,
			entity: Recipe,
		},
		{
			repository: RecipeReviewRepository,
			entity: RecipeReview,
		},
		{
			repository: TagRepository,
			entity: Tag,
		},
		{
			repository: TopicRepository,
			entity: Topic,
		},
		{
			repository: UserRepository,
			entity: User,
		},
		{
			repository: UserReviewRepository,
			entity: UserReview,
		},
	],
	entities,
	schemas: [
		`${__dirname}/schema/**/*.graphql`,
	],
	customResolvers: {
		DateTime: GraphQLDateTime,
	},
	cors: true,
	logger: (err) => console.log(err),
}).then(() => {
	console.log(`Server is up and running on http://localhost:10262
Playground is up at http://localhost:10262/playground`);
}).catch(err => {
	console.log(`Unable to bootstap server: ${err}`);
});
