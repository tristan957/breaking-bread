import { Controller, Mutation, Query } from "vesper";
import { IAllergyArgs, IAllergySaveArgs } from "../args/AllergyControllerArgs";
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
		return this.allergyRepository.findOne(args.id);
	}

	@Mutation()
	public async allergySave(args: IAllergySaveArgs): Promise<Allergy> {
		const allergy: Allergy | undefined = await this.allergyRepository.findOne({ name: args.name });
		return allergy === undefined ? this.allergyRepository.save(this.allergyRepository.create(args)) : allergy;
	}
}
