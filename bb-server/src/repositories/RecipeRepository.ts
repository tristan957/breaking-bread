import { Service } from "typedi";
import { DeepPartial, EntityManager, Repository } from "typeorm";
import { AllergyRepository, TagRepository } from ".";
import { Allergy, Recipe, Tag, User } from "../entities";

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

	public async toggleTags(recipeID: number, tags: DeepPartial<Tag>[], currentUser: User): Promise<Tag[] | undefined> {
		const recipe: Recipe | undefined = await this.findOne(recipeID, { relations: ["tags", "author"] });
		// TODO: please check the above to make sure it works
		if (recipe === undefined || recipe.author.id !== currentUser.id) { return undefined; }

		this.tagRepository.toggleTagsList(recipe.tags, tags);
		await this.save(recipe);
		return recipe.tags;
	}

	public async toggleAllergies(recipeID: number, allergies: DeepPartial<Allergy>[], currentUser: User): Promise<Allergy[] | undefined> {
		const recipe: Recipe | undefined = await this.findOne(recipeID, { relations: ["allergies", "author"] });
		// TODO: please check the above to make sure it works
		if (recipe === undefined || recipe.author.id !== currentUser.id) { return undefined; }

		this.allergyRepository.toggleAllergies(recipe.allergies, allergies);
		await this.save(recipe);
		return recipe.allergies;
	}
}
