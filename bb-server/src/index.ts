import { GraphQLDateTime } from "graphql-iso-date";
import { ContainerInstance } from "typedi";
import { getManager } from "typeorm";
import { Action, bootstrap } from "vesper";
import { controllers } from "./controllers";
import { entities } from "./entities";
import User from "./entities/User";

bootstrap({
	port: 10262,
	controllers,
	entities,
	schemas: [
		`${__dirname}/schema/**/*.graphql`,
	],
	customResolvers: {
		DateTime: GraphQLDateTime,
	},
	setupContainer: async (container: ContainerInstance, action: Action) => {
		const request = action.request; // user request, you can get http headers from it
		const user = getManager().findOneOrFail(User, { oAuthSub: request!.headers.oauthsub as string });
		container.set(User, user);
	},
	cors: true,
}).then(() => {
	console.log(`Server is up and running on http://localhost:10262
	Playground is up at http://localhost:10262/playground`);
}).catch(err => {
	console.log(`Unable to bootstap server: ${err}`);
});
