import { Service } from "typedi";
import { EntityManager, Repository } from "typeorm";
import RecipeReview from "../entities/RecipeReview";

@Service()
export default class RecipeReviewRepository extends Repository<RecipeReview> {
	private entityManager: EntityManager;

	constructor(entityManager: EntityManager) {
		super();

		this.entityManager = entityManager;
	}
}
