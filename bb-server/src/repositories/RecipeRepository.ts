import { Service } from "typedi";
import { EntityManager } from "typeorm";
import Repository from "./Repository";

@Service()
export default class RecipeRepository extends Repository {
	constructor(entityManager: EntityManager) {
		super(entityManager);
	}
}
