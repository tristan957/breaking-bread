import { EntityManager } from "typeorm";
import { Controller, Mutation, Query } from "vesper";
import Recipe from "../entities/Recipe";
import RecipeReview from "../entities/RecipeReview";

@Controller()
export default class RecipeController {
	private entityManager: EntityManager;

	constructor(entityManager: EntityManager) {
		this.entityManager = entityManager;
	}

	@Query()
	public recipe(args: IRecipeArgs): Promise<Recipe | undefined> {
		return this.entityManager.findOne(Recipe, args.id);
	}

	@Query()
	public recipeReview(): Promise<RecipeReview | undefined> {

	}

	@Mutation()
	public recipeSave(args: IRecipeSaveArgs): Promise<Recipe> {
		const recipe = this.entityManager.create(Recipe, args);
		return this.entityManager.save(Recipe, recipe);
	}

	@Mutation()
	public recipeEdit(): Promise<Recipe | undefined> {

	}

	@Mutation()
	public recipeToggleTags(): Promise<Tag[] | undefined> {

	}

	@Mutation()
	public recipeToggleAllergies(): Promise<Allergy[] | undefined> {

	}

	@Mutation()
	public recipeReviewSave(): Promise<RecipeReview> {

	}

	@Mutation()
	public recipeReviewEdit(): Promise<RecipeReview | undefined> {

	}
}

interface IRecipeArgs {
	id: number;
}

interface IRecipeSaveArgs {
	name: string;
}
