import { EntityManager } from "typeorm";
import { Resolve, Resolver, ResolverInterface } from "vesper";
import Meal from "../entities/Meal";
import User from "../entities/User";

@Resolver(User)
export class UserResolver implements ResolverInterface<User> {
	private entityManager: EntityManager;

	constructor(entityManager: EntityManager) {
		this.entityManager = entityManager;
	}

	@Resolve()
	public upcomingMeals(user: User): Meal[] {

	}
}
