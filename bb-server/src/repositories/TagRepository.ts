import { Service } from "typedi";
import { DeepPartial, EntityManager, Repository } from "typeorm";
import { Tag } from "../entities";
import { toggleItemByID } from "./utilities/toggleByID";

@Service()
export default class TagRepository extends Repository<Tag> {
	private entityManager: EntityManager;

	constructor(entityManager: EntityManager) {
		super();

		this.entityManager = entityManager;
	}

	public async toggleTagsList(tagList: Tag[], tags: DeepPartial<Tag>[]): Promise<void> {
		for (const toggleTag of tags) {
			let tag: Tag | undefined = toggleTag.id !== undefined
				? await this.findOne(toggleTag.id)
				: await this.findOne({ name: toggleTag.name });

			if (tag === undefined) {
				tag = await this.save(this.create({ name: toggleTag.name }));
			}

			toggleItemByID(tagList, tag);
		}
	}
}
