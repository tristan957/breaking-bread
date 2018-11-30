import { Service } from "typedi";
import { EntityManager, Repository } from "typeorm";
import { AllergyRepository, TagRepository } from ".";
import { Recipe } from "../entities";

@Service()
export default class RecipeRepository extends Repository<Recipe> {
	private entityManager: EntityManager;

	constructor(entityManager: EntityManager, tagRepository: TagRepository, allergyRepository: AllergyRepository) {
		super();

		this.entityManager = entityManager;
	}
}
