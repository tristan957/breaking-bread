import { Service } from "typedi";
import { EntityManager } from "typeorm";

@Service()
export default class TopicRepository {
	private entityManager: EntityManager;

	constructor(entityManager: EntityManager) {
		this.entityManager = entityManager;
	}
}
