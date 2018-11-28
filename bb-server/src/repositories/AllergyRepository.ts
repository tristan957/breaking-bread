import { Service } from "typedi";
import { DeepPartial, EntityManager } from "typeorm";
import { Allergy } from "../entities";
import { toggleItemByID } from "./utilities/toggleByID";

@Service()
export default class AllergyRepository {
	public entityManager: EntityManager;

	constructor(entityManager: EntityManager) {
		this.entityManager = entityManager;
	}

	public async toggleAllergies(allergyList: Allergy[], allergies: DeepPartial<Allergy>[]): Promise<void> {
		for (const toggleAllergy of allergies) {
			let allergy: Allergy | undefined = toggleAllergy.id !== undefined
				? await this.entityManager.findOne(Allergy, toggleAllergy.id)
				: await this.entityManager.findOne(Allergy, { name: toggleAllergy.name });

			if (allergy === undefined) {
				allergy = await this.entityManager.save(Allergy, this.entityManager.create(Allergy, { name: toggleAllergy.name }));
			}

			toggleItemByID(allergyList, allergy);
		}
	}
}
