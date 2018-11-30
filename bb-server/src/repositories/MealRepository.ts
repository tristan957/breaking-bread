import { Service } from "typedi";
import { EntityManager, Repository } from "typeorm";
import { Meal } from "../entities";

@Service()
export default class MealRepository extends Repository<Meal> {
	private entityManager: EntityManager;

	constructor(entityManager: EntityManager) {
		super();

		this.entityManager = entityManager;
	}
}
