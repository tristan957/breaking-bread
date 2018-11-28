import { Service } from "typedi";
import { EntityManager, Repository } from "typeorm";
import { TagRepository } from ".";
import Recipe from "../entities/Recipe";
import Tag from "../entities/Tag";

@Service()
export default class RecipeRepository extends Repository<Recipe> {
	private entityManager: EntityManager;
	private tagRepository: TagRepository;

	constructor(entityManager: EntityManager, tagRepository: TagRepository) {
		super();

		this.entityManager = entityManager;
		this.tagRepository = tagRepository;
	}

	public async toggleTags(recipeID: number, tags: DeepPartial<Tag>[]): Promise<Tag[] | undefined> {
		const recipe: Recipe | undefined = await this.findOne(recipeID, { relations: ["tags"] });
		// TODO: please check the above to make sure it works
		if (recipe === undefined) { return undefined; }

		this.tagRepository.toggleTagsList(recipe.tags, tags);
		this.save(recipe);
		return recipe.tags;
	}
}
