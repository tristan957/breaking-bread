import { EntityManager } from "typeorm";
import { Controller, Mutation, Query } from "vesper";
import Topic from "../entities/Topic";

@Controller()
export default class TagController {
	private entityManager: EntityManager;

	constructor(entityManager: EntityManager) {
		this.entityManager = entityManager;
	}

	@Query()
	public topic(args: ITopicArgs): Promise<Topic | undefined> {
		return this.entityManager.findOne(Topic, args.id);
	}

	@Mutation()
	public topicSave(args: ITopicSaveArgs): Promise<Topic> {
		const topic = this.entityManager.create(Topic, args);
		return this.entityManager.save(Topic, topic);
	}
}

interface ITopicArgs {
	id: number;
}

interface ITopicSaveArgs {
	name: string;
}
