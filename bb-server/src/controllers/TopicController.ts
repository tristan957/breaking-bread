import { Controller, Mutation, Query } from "vesper";
import { ITopicArgs, ITopicSaveArgs } from "../args/TopicControllerArgs";
import { User } from "../entities";
import Topic from "../entities/Topic";
import { TopicRepository } from "../repositories";
import { invalidUser } from "../utilities/validateUser";

@Controller()
export default class TopicController {
	private topicRepository: TopicRepository;
	private currentUser: User;

	constructor(topicRepoistory: TopicRepository, user: User) {
		this.topicRepository = topicRepoistory;
		this.currentUser = user;
	}

	@Query()
	public topic(args: ITopicArgs): Promise<Topic | undefined> {
		return this.topicRepository.getEntityManager().findOne(Topic, args.id);
	}

	@Mutation()
	public async topicSave(args: ITopicSaveArgs): Promise<Topic | undefined> {
		if (invalidUser(this.currentUser)) { return undefined; }
		const topic: Topic | undefined = await this.topicRepository.getEntityManager().findOne(Topic, { name: args.name });
		return topic === undefined ? this.topicRepository.getEntityManager().save(Topic, this.topicRepository.getEntityManager().create(Topic, {
			name: args.name.toLowerCase().replace(/\s/g, ""),
		})) : topic;
	}
}
