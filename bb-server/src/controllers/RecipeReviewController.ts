import { EntityManager } from "typeorm";
import { Controller, Mutation, Query } from "vesper";
import RecipeReview from "../entities/RecipeReview";

@Controller()
export default class RecipeReviewController {
	private entityManager: EntityManager;

	constructor(entityManager: EntityManager) {
		this.entityManager = entityManager;
	}

	@Query()
	public RecipeReview(args: IRecipeReviewArgs): Promise<RecipeReview | undefined> {
		return this.entityManager.findOne(RecipeReview, args.id);
	}

	@Mutation()
	public RecipeReviewSave(args: IRecipeReviewSaveArgs): Promise<RecipeReview> {
		const meal = this.entityManager.create(RecipeReview, args);
		return this.entityManager.save(RecipeReview, meal);
	}
}

interface IRecipeReviewArgs {
	id: number;
}

interface IRecipeReviewSaveArgs {
	name: string;
}
