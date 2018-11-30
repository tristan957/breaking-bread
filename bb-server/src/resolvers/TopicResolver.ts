import { Resolve, Resolver, ResolverInterface } from "vesper";
import { Topic, User } from "../entities";
import { TopicRepository } from "../repositories";

@Resolver(Topic)
export default class TopicResolver implements ResolverInterface<Topic> {
	private topicRepository: TopicRepository;

	constructor(topicRepository: TopicRepository) {
		this.topicRepository = topicRepository;
	}

	@Resolve()
	public async blackListedBy(topic: Topic): Promise<User[] | []> {
		const topicFull: Topic | undefined = await this.topicRepository.findOne(topic.id, { relations: ["blackListedBy"] });
		if (topicFull === undefined) { return []; }

		return topicFull.blackListedBy;
	}

	@Resolve()
	public async whiteListedBy(topic: Topic): Promise<User[] | []> {
		const topicFull: Topic | undefined = await this.topicRepository.findOne(topic.id, { relations: ["whiteListedBy"] });
		if (topicFull === undefined) { return []; }

		return topicFull.whiteListedBy;
	}
}
