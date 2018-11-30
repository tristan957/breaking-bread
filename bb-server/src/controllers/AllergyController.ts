import { Controller, Mutation, Query } from "vesper";
import { IAllergyArgs, IAllergySaveArgs } from "../args/AllergyControllerArgs";
import { Allergy, User } from "../entities";
import { AllergyRepository } from "../repositories";
import { invalidUser } from "./utilities/validateUser";

@Controller()
export default class AllergyController {
	private allergyRepository: AllergyRepository;
	private currentUser: User;

	constructor(allergyRepository: AllergyRepository, user: User) {
		this.allergyRepository = allergyRepository;
		this.currentUser = user;
	}

	@Query()
	public allergy(args: IAllergyArgs): Promise<Allergy | undefined> {
		return this.allergyRepository.findOne(args.id);
	}

	@Mutation()
	public async allergySave(args: IAllergySaveArgs): Promise<Allergy | undefined> {
		if (invalidUser(this.currentUser)) { return undefined; }
		const allergy: Allergy | undefined = await this.allergyRepository.findOne({ name: args.name });
		return allergy === undefined ? this.allergyRepository.save(this.allergyRepository.create({
			name: args.name.toLowerCase(),
		})) : allergy;
	}
}
