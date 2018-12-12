import { Service } from "typedi";
import { DeepPartial, EntityManager } from "typeorm";
import { Topic } from "../entities";
import Repository from "./Repository";
import { toggleItemByID } from "./utilities/toggleByID";

@Service()
export default class TopicRepository extends Repository {
	constructor(entityManager: EntityManager) {
		super(entityManager);
	}

	public async toggleTopicsList(topicList: Topic[], topics: DeepPartial<Topic>[]): Promise<void> {
		for (const toggleTopic of topics) {
			let topic: Topic | undefined = toggleTopic.id !== undefined
				? await this.entityManager.findOne(Topic, toggleTopic.id)
				: await this.entityManager.findOne(Topic, { name: toggleTopic.name });

			if (topic === undefined) {
				topic = await this.entityManager.save(this.entityManager.create(Topic, { name: toggleTopic.name.toLowerCase().replace(/\s/g, "") }));
			}

			await toggleItemByID(topicList, topic);
		}
	}
}
