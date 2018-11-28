import { Service } from "typedi";
import { EntityManager, Repository } from "typeorm";
import { UserReview } from "../entities";

@Service()
export default class UserReviewRepository extends Repository<UserReview> {
	private entityManager: EntityManager;

	constructor(entityManager: EntityManager) {
		super();

		this.entityManager = entityManager;
	}
}
