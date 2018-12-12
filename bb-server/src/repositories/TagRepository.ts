import { Service } from "typedi";
import { DeepPartial, EntityManager } from "typeorm";
import { Tag } from "../entities";
import Repository from "./Repository";
import { toggleItemByID } from "./utilities/toggleByID";

@Service()
export default class TagRepository extends Repository {
	constructor(entityManager: EntityManager) {
		super(entityManager);
	}

	public async toggleTagsList(tagList: Tag[], tags: DeepPartial<Tag>[]): Promise<void> {
		for (const toggleTag of tags) {
			let tag: Tag | undefined = toggleTag.id !== undefined
				? await this.entityManager.findOne(Tag, toggleTag.id)
				: await this.entityManager.findOne(Tag, { name: toggleTag.name });

			if (tag === undefined) {
				tag = await this.entityManager.save(this.entityManager.create(Tag, { name: toggleTag.name.toLowerCase().replace(/\s/g, "") }));
			}

			await toggleItemByID(tagList, tag);
		}
	}
}
