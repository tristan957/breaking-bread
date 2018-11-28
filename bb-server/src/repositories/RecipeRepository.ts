import { Service } from "typedi";
import { EntityManager, Repository } from "typeorm";
import Recipe from "../entities/Recipe";

@Service()
export default class RecipeRepository extends Repository<Recipe> {
	private entityManager: EntityManager;

	constructor(entityManager: EntityManager) {
		super();

		this.entityManager = entityManager;
	}
}
