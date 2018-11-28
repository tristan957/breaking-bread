import { EntityManager } from "typeorm";
import { Controller, Mutation, Query } from "vesper";
import Tag from "../entities/Tag";

@Controller()
export default class TagController {
	private entityManager: EntityManager;

	constructor(entityManager: EntityManager) {
		this.entityManager = entityManager;
	}

	@Query()
	public tag(args: ITagArgs): Promise<Tag | undefined> {
		return this.entityManager.findOne(Tag, args.id);
	}

	@Mutation()
	public tagSave(args: ITagSaveArgs): Promise<Tag> {
		const tag = this.entityManager.create(Tag, args);
		return this.entityManager.save(Tag, tag);
	}
}

interface ITagArgs {
	id: number;
}

interface ITagSaveArgs {
	name: string;
}
