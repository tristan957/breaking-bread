import { Service } from "typedi";
import { EntityManager, Repository } from "typeorm";
import Recipe from "../entities/Recipe";
import Tag from "../entities/Tag";

@Service()
export default class TagRepository extends Repository<Tag> {
	private entityManager: EntityManager;

	constructor(entityManager: EntityManager) {
		super();

		this.entityManager = entityManager;
	}

	public async toggleTags(recipe: Recipe, tagNames: string[]): Promise<void> {
		for (const name of tagNames) {
			let tag: Tag | undefined = await this.findOne({ name });
			if (tag === undefined) {
				tag = await this.save(this.create({ name }));
			}

			recipe.tags.forEach((t, i, self) => {
				if (t.name === tag!.name) {
					self.slice(i, 1);
				} else {
					self.push(tag!);
				}
			});
		}
	}
}
