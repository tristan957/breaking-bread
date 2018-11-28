import { Service } from "typedi";
import { EntityManager, Repository } from "typeorm";
import Tag from "../entities/Tag";

@Service()
export default class TagRepository extends Repository<Tag> {
	private entityManager: EntityManager;

	constructor(entityManager: EntityManager) {
		super();

		this.entityManager = entityManager;
	}
}
