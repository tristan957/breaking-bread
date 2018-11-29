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
	public async savedBy(recipe: Recipe): Promise<User[] | undefined> {
		const recipeFull: Recipe | undefined = await this.recipeRepository.findOne(recipe.id, {
			relations: ["savedBy"],
		});
		if (recipeFull === undefined) { return undefined; }

		return recipeFull.savedBy;
	}

	@Resolve()
	public async timesSaved(recipe: Recipe): Promise<number | undefined> {
		const recipeFull: Recipe | undefined = await this.recipeRepository.findOne(recipe.id, {
			relations: ["savedBy"],
		});
		if (recipeFull === undefined) { return undefined; }

		return recipeFull.savedBy.length;
	}

	@Resolve()
	public async mealsServedAt(recipe: Recipe): Promise<Meal[] | undefined> {
		const recipeFull: Recipe | undefined = await this.recipeRepository.findOne(recipe.id, {
			relations: ["mealsServedAt"],
		});
		if (recipeFull === undefined) { return undefined; }

		return recipeFull.mealsServedAt;
	}
}
