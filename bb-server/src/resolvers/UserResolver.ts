import { Resolve, Resolver, ResolverInterface } from "vesper";
import { Meal, User } from "../entities";
import { UserRepository } from "../repositories";

@Resolver(User)
export default class UserResolver implements ResolverInterface<User> {
	private userRepository: UserRepository;

	constructor(userRepository: UserRepository) {
		this.userRepository = userRepository;
	}

	@Resolve()
	public async name(user: User): Promise<string> {
		const name = `${user.firstName} ${user.lastName}`;
		return name;
	}

	@Resolve()
	public async hostedMeals(user: User): Promise<Meal[] | []> {
		const fullUser: User | undefined = await this.userRepository.findOne(user.id, {
			relations: ["hostedMeals"],
		});
		if (fullUser === undefined) { return []; }
		return fullUser.hostedMeals;
	}

	@Resolve()
	public async followers(user: User): Promise<User[] | []> {
		const fullUser: User | undefined = await this.userRepository.findOne(user.id, {
			relations: ["followers"],
		});
		if (fullUser === undefined) { return []; }
		return fullUser.followers;
	}

	@Resolve()
	public async numberOfFollowers(user: User): Promise<number> {
		const fullUser: User | undefined = await this.userRepository.findOne(user.id, {
			relations: ["followers"],
		});
		if (fullUser === undefined) { return -1; }

		return fullUser.followers.length;
	}

	@Resolve()
	public async upcomingMeals(user: User): Promise<Meal[] | []> {
		const fullUser: User | undefined = await this.userRepository.findOne(user.id, {
			relations: ["mealsAttending", "hostedMeals"],
		});
		if (fullUser === undefined) { return []; }

		const bothMealLists: Meal[] = fullUser.mealsAttending.concat(fullUser.hostedMeals);
		const retVal: Meal[] = [];
		for (const meal of bothMealLists) {
			if (meal.startTime > new Date()) {  // If the meal is in the future
				retVal.push(meal);
			}
		}
		retVal.sort((a: Meal, b: Meal): number => {
			return a.startTime.valueOf() - b.startTime.valueOf();
		});

		return retVal;
	}

	@Resolve()
	public async reviewAverage(user: User): Promise<number> {
		const fullUser: User | undefined = await this.userRepository.findOne(user.id, {
			relations: ["reviews"],
		});
		if (fullUser === undefined) { return -1; }
		if (fullUser.reviews.length === 0) { return 0; }

		let runningTotal = 0;
		for (const review of fullUser.reviews) {
			runningTotal += review.rating;
		}

		return runningTotal / fullUser.reviews.length;
	}
}
