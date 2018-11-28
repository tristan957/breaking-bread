
import { GraphQLDateTime } from "graphql-iso-date";
import { bootstrap } from "vesper";
import { AllergyController } from "./controllers";
import { Allergy } from "./entities";
import { AllergyRepository } from "./repositories";

bootstrap({
	port: 10262,
	controllers: [
		AllergyController,
	],
	entities: [
		Allergy,
	],
	entityRepositories: [
		{
			repository: AllergyRepository,
			entity: Allergy,
		},
		// {
		// 	repository: MealRepository,
		// 	entity: Meal,
		// },
		// {
		// 	repository: RecipeRepository,
		// 	entity: Recipe,
		// },
		// {
		// 	repository: RecipeReviewRepository,
		// 	entity: RecipeReview,
		// },
		// {
		// 	repository: TagRepository,
		// 	entity: Tag,
		// },
		// {
		// 	repository: TopicRepository,
		// 	entity: Topic,
		// },
		// {
		// 	repository: UserRepository,
		// 	entity: User,
		// },
		// {
		// 	repository: UserReviewRepository,
		// 	entity: UserReview,
		// },
	],
	// resolvers: [
	// 	{
	// 		resolver: UserResolver,
	// 		model:
	// 	}
	// ],
	schemas: [
		`${__dirname}/schema/**/*.graphql`,
	],
	customResolvers: {
		DateTime: GraphQLDateTime,
	},
	// setupContainer: async (container: ContainerInstance, action: Action) => {
	// 	console.log("'hello'");
	// 	const request = action.request; // user request, you can get http headers from it
	// 	const user = getManager().findOneOrFail(User, { oAuthSub: request!.headers.oauthsub as string });
	// 	container.set(User, user);
	// },
	cors: true,
}).then(() => {
	console.log(`Server is up and running on http://localhost:10262
	Playground is up at http://localhost:10262/playground`);
}).catch(err => {
	console.log(`Unable to bootstap server: ${err}`);
});
