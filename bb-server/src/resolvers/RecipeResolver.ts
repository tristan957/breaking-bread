import { Resolve, Resolver, ResolverInterface } from "vesper";
import { Meal, Recipe, User } from "../entities";
import { RecipeRepository } from "../repositories";

@Resolver(Recipe)
export default class RecipeResolver implements ResolverInterface<Recipe> {
	private recipeRepository: RecipeRepository;

	constructor(recipeRepository: RecipeRepository) {
		this.recipeRepository = recipeRepository;
	}

	@Resolve()
	public async savedBy(recipe: Recipe): Promise<User[] | []> {
		const recipeFull: Recipe | undefined = await this.recipeRepository.findOne(recipe.id, {
			relations: ["savedBy"],
		});
		if (recipeFull === undefined) { return []; }

		return recipeFull.savedBy;
	}

	@Resolve()
	public async timesSaved(recipe: Recipe): Promise<number> {
		const recipeFull: Recipe | undefined = await this.recipeRepository.findOne(recipe.id, {
			relations: ["savedBy"],
		});
		if (recipeFull === undefined) { return -1; }

		return recipeFull.savedBy.length;
	}

	@Resolve()
	public async reviewAverage(recipe: Recipe): Promise<number> {
		const fullRecipe: Recipe | undefined = await this.recipeRepository.findOne(recipe.id, {
			relations: ["reviews"],
		});
		if (fullRecipe === undefined) { return -1; }
		if (fullRecipe.reviews.length === 0) { return 0; }

		let runningTotal = 0;
		for (const review of fullRecipe.reviews) {
			runningTotal += review.rating;
		}

		return runningTotal / fullRecipe.reviews.length;
	}

	@Resolve()
	public async mealsServedAt(recipe: Recipe): Promise<Meal[] | []> {
		const recipeFull: Recipe | undefined = await this.recipeRepository.findOne(recipe.id, {
			relations: ["mealsServedAt"],
		});
		if (recipeFull === undefined) { return []; }

		return recipeFull.mealsServedAt;
	}
}
