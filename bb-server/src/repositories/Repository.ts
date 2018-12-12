import { EntityManager } from "typeorm";

export default class Repository {
	protected entityManager: EntityManager;

	constructor(entityManager: EntityManager) {
		this.entityManager = entityManager;
	}

	public getEntityManager(): EntityManager {
		return this.entityManager;
	}
}
