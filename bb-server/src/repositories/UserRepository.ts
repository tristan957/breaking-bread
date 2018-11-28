import { Service } from "typedi";
import { DeepPartial, EntityManager, Repository } from "typeorm";
import { TagRepository, TopicRepository } from ".";
import { Tag, Topic, User } from "../entities";

@Service()
export default class UserRepository extends Repository<User> {
	private entityManager: EntityManager;
	private tagRepository: TagRepository;
	private topicRepository: TopicRepository;

	constructor(entityManager: EntityManager, tagRepository: TagRepository, topicRepository: TopicRepository) {
		super();

		this.entityManager = entityManager;
		this.tagRepository = tagRepository;
		this.topicRepository = topicRepository;
	}

	public async toggleFollowedTags(currentUser: User, tags: DeepPartial<Tag>[]): Promise<Tag[] | undefined> {
		const user: User | undefined = await this.findOne(currentUser.id, { relations: ["tags"] });
		// TODO: please check the above to make sure it works
		if (user === undefined) { return undefined; }

		this.tagRepository.toggleTagsList(user.followedTags, tags);
		this.save(user);
		return user.followedTags;
	}

	public async toggleBlacklist(currentUser: User, topics: DeepPartial<Topic>[]): Promise<Topic[] | undefined> {
		const user: User | undefined = await this.findOne(currentUser.id, { relations: ["blacklist"] });
		// TODO: please check the above to make sure it works
		if (user === undefined) { return undefined; }

		this.topicRepository.toggleTopicsList(user.blacklist, topics);
		this.save(user);
		return user.blacklist;
	}

	public async toggleWhitelist(currentUser: User, topics: DeepPartial<Topic>[]): Promise<Topic[] | undefined> {
		const user: User | undefined = await this.findOne(currentUser.id, { relations: ["whitelist"] });
		// TODO: please check the above to make sure it works
		if (user === undefined) { return undefined; }

		this.topicRepository.toggleTopicsList(user.whitelist, topics);
		this.save(user);
		return user.whitelist;
	}
}
