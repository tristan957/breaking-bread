import { Service } from "typedi";
import { EntityManager, Repository } from "typeorm";
import Topic from "../entities/Topic";

@Service()
export default class TopicRepository extends Repository<Topic> {
	private entityManager: EntityManager;

	constructor(entityManager: EntityManager) {
		super();

		this.entityManager = entityManager;
	}
}
