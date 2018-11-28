import { EntityManager } from "typeorm";
import { Controller, Mutation, Query } from "vesper";
import User from "../entities/User";

@Controller()
export default class UserController {
	private entityManager: EntityManager;

	constructor(entityManager: EntityManager) {
		this.entityManager = entityManager;
	}

	@Query()
	public User(args: IUserArgs): Promise<User | undefined> {
		return this.entityManager.findOne(User, args.id);
	}

	@Mutation()
	public UserSave(args: IUserSaveArgs): Promise<User> {
		const meal = this.entityManager.create(User, args);
		return this.entityManager.save(User, meal);
	}
}

interface IUserArgs {
	id: number;
}

interface IUserSaveArgs {
	name: string;
}
