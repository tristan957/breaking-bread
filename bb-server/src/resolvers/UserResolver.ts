import { Resolve, Resolver, ResolverInterface } from "vesper";
import { Meal, User } from "../entities";
import { UserRepository } from "../repositories";

@Resolver(User)
export class UserResolver implements ResolverInterface<User> {
	private userRepository: UserRepository;

	constructor(userRepository: UserRepository) {
		this.userRepository = userRepository;
	}

	@Resolve()
	public async hostedMeals(user: User): Promise<Meal[] | undefined> {
		const fullUser: User | undefined = await this.userRepository.findOne(user.id, {
			relations: ["hostedMeals"],
		});
		if (fullUser === undefined) { return undefined; }
		return fullUser.hostedMeals;
	}

	@Resolve()
	public async followers(user: User): Promise<User[] | undefined> {
		const fullUser: User | undefined = await this.userRepository.findOne(user.id, {
			relations: ["followers"],
		});
		if (fullUser === undefined) { return undefined; }
		return fullUser.followers;
	}

	@Resolve()
	public async upcomingMeals(user: User): Promise<Meal[] | undefined> {
		const fullUser: User | undefined = await this.userRepository.findOne(user.id, {
			relations: ["mealsAttending"],
		});
		if (fullUser === undefined) { return undefined; }

		const retVal: Meal[] = [];
		for (const meal of fullUser.mealsAttending) {
			if (meal.startTime > new Date()) {  // If the meal is in the future
				retVal.push(meal);
			}
		}
		retVal.sort((a: Meal, b: Meal): number => {
			return a.startTime.valueOf() - b.startTime.valueOf();
		});

		return retVal;
	}
}
