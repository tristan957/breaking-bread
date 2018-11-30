import { Service } from "typedi";
import { DeepPartial, EntityManager, Repository } from "typeorm";
import { Topic } from "../entities";
import { toggleItemByID } from "./utilities/toggleByID";

@Service()
export default class TopicRepository extends Repository<Topic> {
	private entityManager: EntityManager;

	constructor(entityManager: EntityManager) {
		super();

		this.entityManager = entityManager;
	}

	public async toggleTopicsList(topicList: Topic[], topics: DeepPartial<Topic>[]): Promise<void> {
		for (const toggleTopic of topics) {
			let topic: Topic | undefined = toggleTopic.id !== undefined
				? await this.findOne(toggleTopic.id)
				: await this.findOne({ name: toggleTopic.name });

			if (topic === undefined) {
				topic = await this.save(this.create({ name: toggleTopic.name.toLowerCase() }));
			}

			await toggleItemByID(topicList, topic);
		}
	}
}
