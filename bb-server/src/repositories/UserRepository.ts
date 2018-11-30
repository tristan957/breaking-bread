import { Service } from "typedi";
import { EntityManager, Repository } from "typeorm";
import { TagRepository, TopicRepository } from ".";
import { User } from "../entities";

@Service()
export default class UserRepository extends Repository<User> {
	private entityManager: EntityManager;

	constructor(entityManager: EntityManager, tagRepository: TagRepository, topicRepository: TopicRepository) {
		super();

		this.entityManager = entityManager;
	}
}
