import { Controller, Mutation, Query } from "vesper";
import { ITagArgs, ITagSaveArgs } from "../args/TagControllerArgs";
import { User } from "../entities";
import Tag from "../entities/Tag";
import { TagRepository } from "../repositories";
import { invalidUser } from "../utilities/validateUser";

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
		return this.tagRepository.getEntityManager().findOne(Tag, args.id);
	}

	@Mutation()
	public async tagSave(args: ITagSaveArgs): Promise<Tag | undefined> {
		if (invalidUser(this.currentUser)) { return undefined; }
		const tag: Tag | undefined = await this.tagRepository.getEntityManager().findOne(Tag, { name: args.name });
		return tag === undefined ? this.tagRepository.getEntityManager().save(this.tagRepository.getEntityManager().create(Tag, {
			name: args.name.toLowerCase(),
		})) : tag;
	}
}
