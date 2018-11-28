import { Controller, Mutation, Query } from "vesper";
import { Allergy } from "../entities";
import { AllergyRepository } from "../repositories";

@Controller()
export default class AllergyController {
	private allergyRepository: AllergyRepository;

	constructor(allergyRepository: AllergyRepository) {
		this.allergyRepository = allergyRepository;
	}

	@Query()
	public allergy(args: IAllergyArgs): Promise<Allergy | undefined> {
		return this.allergyRepository.entityManager.findOne(Allergy, args.id);
	}

	@Mutation()
	public async allergySave(args: IAllergySaveArgs): Promise<Allergy> {
		const allergy: Allergy | undefined = await this.allergyRepository.entityManager.findOne(Allergy, { name: args.name });
		return allergy === undefined ? this.allergyRepository.entityManager.save(Allergy, this.allergyRepository.entityManager.create(Allergy, args)) : allergy;
	}
}

interface IAllergyArgs {
	id: number;
}

interface IAllergySaveArgs {
	name: string;
}
