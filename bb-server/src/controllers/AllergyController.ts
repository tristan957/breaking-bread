import { EntityManager } from "typeorm";
import { Controller, Mutation, Query } from "vesper";
import Allergy from "../entities/Allergy";

@Controller()
export default class AllergyController {
	private entityManager: EntityManager;

	constructor(entityManager: EntityManager) {
		this.entityManager = entityManager;
	}

	@Query()
	public allergy(args: IAllergyArgs): Promise<Allergy | undefined> {
		return this.entityManager.findOne(Allergy, args.id);
	}

	@Mutation()
	public allergySave(args: IAllergySaveArgs): Promise<Allergy> {
		const allergy = this.entityManager.create(Allergy, args);
		return this.entityManager.save(Allergy, allergy);
	}
}

interface IAllergyArgs {
	id: number;
}

interface IAllergySaveArgs {
	name: string;
}
