import { Service } from "typedi";
import { EntityManager, Repository } from "typeorm";
import User from "../entities/User";

interface IGenericItem {
	id: number;
}

@Service()
export default class UserRepository extends Repository<User> {
	private entityManager: EntityManager;

	constructor(entityManager: EntityManager) {
		super();

		this.entityManager = entityManager;
	}

	public toggleItem<T extends IGenericItem>(followedList: T[], toToggle: T): void {
		const followedIDs: number[] = followedList.map(item => item.id);
		const index: number = followedIDs.indexOf(toToggle.id);
		if (index < 0) {
			followedList.push(toToggle);
		} else {
			followedList.splice(index, 1);
		}
	}
}
