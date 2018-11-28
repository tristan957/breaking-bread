import { Resolve, Resolver, ResolverInterface } from "vesper";
import Meal from "../entities/Meal";
import User from "../entities/User";
import { MealRepository, UserRepository } from "../repositories";

@Resolver(User)
export class UserResolver implements ResolverInterface<User> {
	private mealRepository: MealRepository;
	private userRepository: UserRepository;
	private currentUser: User;

	constructor(userRepository: UserRepository, user: User) {
		this.userRepository = userRepository;
	}

	@Resolve()
	public async upcomingMeals(user: User): Promise<Meal[] | undefined> {
		const meals: Meal[] = await user.mealsAttending;
		// const neededRelations: string[] = [
		// 	"host", "guests", "recipes", // We don't need these now right? Like resolvers would be best
		// ]; // I think so, we will see on front end for now. is this param correct? what param JUST TAKE A USER ID CHECK WHERE GUESTS INCLUDES ID

		const retVal: Meal[] = [];
		for (const meal of meals) {
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
