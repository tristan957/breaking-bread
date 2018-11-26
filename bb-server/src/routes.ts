import { default as express } from "express";
import { addGuestRSVP, deleteGuestRSVP } from "./controllers/meal";
import { createRecipeReview, deleteRecipeReview } from "./controllers/recipe";
import { addFollower, addSavedRecipe, removeFollower, removeSavedRecipe } from "./controllers/user";

type Route = {
	method: "GET" | "POST" | "DELETE";
	route: string;
	handler(req: express.Request, res: express.Response): void;
};

type Router = {
	route: string;
	subRoutes: Route[];
};

const routers: Router[] = [
	{
		route: "/users",
		subRoutes: [
			{
				method: "POST",
				route: "/:userID/followers",
				handler: addFollower,
			},
			{
				method: "DELETE",
				route: "/:userID/followers",
				handler: removeFollower,
			},
			{
				method: "POST",
				route: "/:userID/savedRecipes",
				handler: addSavedRecipe,
			},
			{
				method: "DELETE",
				route: "/:userID/savedRecipes",
				handler: removeSavedRecipe,
			},
		],
	},
	{
		route: "/recipes",
		subRoutes: [
			{
				method: "POST",
				route: "/:recipeID/reviews",
				handler: createRecipeReview,
			},
			{
				method: "DELETE",
				route: "/:recipeID/reviews",
				handler: deleteRecipeReview,
			},
		],
	},
	{
		route: "/meals",
		subRoutes: [
			{
				method: "POST",
				route: "/:mealID/guests",
				handler: addGuestRSVP,
			},
			{
				method: "DELETE",
				route: "/:mealID/guests",
				handler: deleteGuestRSVP,
			},
		],
	},
];

export function addRoutes(app: express.Application): void {
	routers.forEach(router => {
		const r = express.Router();
		router.subRoutes.forEach(route => {
			const fullRoute = `${router.route}${route.route}`;
			console.log(`${route.method} ${fullRoute}`);
			switch (route.method) {
				case "DELETE":
					r.delete(fullRoute, route.handler);
					break;
				case "POST":
					r.post(fullRoute, route.handler);
					break;
				case "GET":
					r.get(fullRoute, route.handler);
					break;
				default:
					console.log(`Unable to add route: ${route.method} ${fullRoute}`);
			}
		});
		app.use(r);
	});
}
