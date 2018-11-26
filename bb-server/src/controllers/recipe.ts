import { Request, Response } from "express";
import { getRepository } from "typeorm";
import Recipe from "../entities/Recipe";
import RecipeReview from "../entities/RecipeReview";
import User from "../entities/User";
import { getItemWSpecRelations } from "./GenericHelpers";

interface IReviewBody {
	id: number;
}

interface ICreateReviewBody {
	rating: number;
	description: string;
	authorID: number;
}

interface IReviewParams {
	recipeID: string;
}

export function createRecipeReview(req: Request, res: Response): void {
	const body: ICreateReviewBody = req.body as ICreateReviewBody;
	const params: IReviewParams = req.params as IReviewParams;

	getItemWSpecRelations<Recipe>(getRepository(Recipe), parseInt(params.recipeID, 10)).then((recipe: Recipe | undefined) => {
		getItemWSpecRelations<User>(getRepository(User), body.authorID).then((user: User | undefined) => {
			if (recipe === undefined || user === undefined) {
				res.send(500);
				return;
			}

			const newReview: RecipeReview = new RecipeReview();
			newReview.rating = body.rating;
			newReview.description = body.description;
			newReview.subject = recipe;
			newReview.author = user;

			getRepository(RecipeReview).save(newReview);
			res.send(JSON.stringify(newReview));
		}).catch((err) => {
			console.log(err);
			res.send(500);
		});
	}).catch((err) => {
		console.log(err);
		res.send(500);
	});
}

export function deleteRecipeReview(req: Request, res: Response): void {
	const body: IReviewBody = req.body as IReviewBody;
	const params: IReviewParams = req.params as IReviewParams;

	getItemWSpecRelations<RecipeReview>(getRepository(RecipeReview), body.id).then((review: RecipeReview | undefined) => {
		if (review === undefined) {
			res.send(500);
			return;
		}

		getRepository(RecipeReview).remove(review);
		res.send(200);
	}).catch((err) => {
		console.log(err);
		res.send(500);
	});
}
