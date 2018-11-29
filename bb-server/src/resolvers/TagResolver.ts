import { Resolve, Resolver, ResolverInterface } from "vesper";
import { Recipe, Tag, User } from "../entities";
import { TagRepository } from "../repositories";

@Resolver(Tag)
export default class TagResolver implements ResolverInterface<Tag> {
	private tagRepository: TagRepository;

	constructor(tagRepository: TagRepository) {
		this.tagRepository = tagRepository;
	}

	@Resolve()
	public async associatedRecipes(tag: Tag): Promise<Recipe[] | undefined> {
		const tagFull: Tag | undefined = await this.tagRepository.findOne(tag.id, { relations: ["associatedRecipes"] });
		if (tagFull === undefined) { return undefined; }

		return tagFull.associatedRecipes;
	}

	@Resolve()
	public async followers(tag: Tag): Promise<User[] | undefined> {
		const tagFull: Tag | undefined = await this.tagRepository.findOne(tag.id, { relations: ["followers"] });
		if (tagFull === undefined) { return undefined; }

		return tagFull.followers;
	}
}
