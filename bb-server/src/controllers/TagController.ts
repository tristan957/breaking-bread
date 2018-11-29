import { Controller, Mutation, Query } from "vesper";
import { ITagArgs, ITagSaveArgs } from "../args/TagControllerArgs";
import Tag from "../entities/Tag";
import { TagRepository } from "../repositories";

@Controller()
export default class TagController {
	private tagRepository: TagRepository;

	constructor(tagRepository: TagRepository) {
		this.tagRepository = tagRepository;
	}

	@Query()
	public tag(args: ITagArgs): Promise<Tag | undefined> {
		return this.tagRepository.findOne(args.id);
	}

	@Mutation()
	public async tagSave(args: ITagSaveArgs): Promise<Tag> {
		const tag: Tag | undefined = await this.tagRepository.findOne({ name: args.name });
		return tag === undefined ? this.tagRepository.save(this.tagRepository.create(args)) : tag;
	}
}
