import { Service } from "typedi";
import { DeepPartial, EntityManager, Repository } from "typeorm";
import { AllergyRepository, TagRepository } from ".";
import { Allergy, Recipe, Tag } from "../entities";

@Service()
export default class RecipeRepository extends Repository<Recipe> {
	private entityManager: EntityManager;
	private tagRepository: TagRepository;
	private allergyRepository: AllergyRepository;

	constructor(entityManager: EntityManager, tagRepository: TagRepository, allergyRepository: AllergyRepository) {
		super();

		this.entityManager = entityManager;
		this.tagRepository = tagRepository;
		this.allergyRepository = allergyRepository;
	}

	public async toggleTags(recipeID: number, tags: DeepPartial<Tag>[]): Promise<Tag[] | undefined> {
		const recipe: Recipe | undefined = await this.findOne(recipeID, { relations: ["tags"] });
		// TODO: please check the above to make sure it works
		if (recipe === undefined) { return undefined; }

		this.tagRepository.toggleTagsList(recipe.tags, tags);
		this.save(recipe);
		return recipe.tags;
	}

	public async toggleAllergies(recipeID: number, allergies: DeepPartial<Allergy>[]): Promise<Allergy[] | undefined> {
		const recipe: Recipe | undefined = await this.findOne(recipeID, { relations: ["allergies"] });
		// TODO: please check the above to make sure it works
		if (recipe === undefined) { return undefined; }

		this.allergyRepository.toggleAllergyList(recipe.allergies, allergies);
		this.save(recipe);
		return recipe.allergies;
	}
}
