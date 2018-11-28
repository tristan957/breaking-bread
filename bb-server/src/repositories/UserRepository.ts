import { Service } from "typedi";
import { EntityManager, Repository } from "typeorm";
import User from "../entities/User";

@Service()
export default class UserRepository extends Repository<User> {
	private entityManager: EntityManager;

	constructor(entityManager: EntityManager) {
		super();

		this.entityManager = entityManager;
	}
}
