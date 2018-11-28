import { Service } from "typedi";
import { EntityManager, Repository } from "typeorm";
import Allergy from "../entities/Allergy";

@Service()
export default class AllergyRepository extends Repository<Allergy> {
	private entityManager: EntityManager;

	constructor(entityManager: EntityManager) {
		super();

		this.entityManager = entityManager;
	}
}
