import { Controller, Mutation, Query } from "vesper";
import { ITagArgs, ITagSaveArgs } from "../args/TagControllerArgs";
import { User } from "../entities";
import Tag from "../entities/Tag";
import { TagRepository } from "../repositories";

@Controller()
export default class TagController {
	private tagRepository: TagRepository;
	private currentUser: User;

	constructor(tagRepository: TagRepository, user: User) {
		this.tagRepository = tagRepository;
		this.currentUser = user;
	}

	@Query()
	public tag(args: ITagArgs): Promise<Tag | undefined> {
		return this.tagRepository.findOne(args.id);
	}

	@Mutation()
	public async tagSave(args: ITagSaveArgs): Promise<Tag | undefined> {
		if (this.currentUser === undefined) { return undefined; }
		const tag: Tag | undefined = await this.tagRepository.findOne({ name: args.name });
		return tag === undefined ? this.tagRepository.save(this.tagRepository.create(args)) : tag;
	}
}
