import { Service } from "typedi";
import { DeepPartial, EntityManager } from "typeorm";
import { Allergy } from "../entities";
import Repository from "./Repository";
import { toggleItemByID } from "./utilities/toggleByID";

@Service()
export default class AllergyRepository extends Repository {
	constructor(entityManager: EntityManager) {
		super(entityManager);
	}

	public async toggleAllergies(allergyList: Allergy[], allergies: DeepPartial<Allergy>[]): Promise<void> {
		for (const toggleAllergy of allergies) {
			let allergy: Allergy | undefined = toggleAllergy.id !== undefined
				? await this.entityManager.findOne(Allergy, toggleAllergy.id)
				: await this.entityManager.findOne(Allergy, { name: toggleAllergy.name });

			if (allergy === undefined) {
				allergy = await this.entityManager.save(this.entityManager.create(
					Allergy,
					{
						name: toggleAllergy.name.toLowerCase(),
					}
				));
			}

			await toggleItemByID(allergyList, allergy);
		}
	}
}
