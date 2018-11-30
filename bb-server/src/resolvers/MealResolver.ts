import { Resolve, Resolver, ResolverInterface } from "vesper";
import { Meal, User } from "../entities";
import { MealRepository } from "../repositories";
import { userToMealMiles } from "../utilities/distanceCalc";
import { getCityFromAddress } from "../utilities/locationInfo";
import { invalidUser } from "../utilities/validateUser";

@Resolver(Meal)
export default class MealResolver implements ResolverInterface<Meal> {
	private mealRepository: MealRepository;
	private currentUser: User;

	constructor(mealRepository: MealRepository, user: User) {
		this.mealRepository = mealRepository;
		this.currentUser = user;
	}

	@Resolve()
	public async city(meal: Meal): Promise<string> {
		const city: string = getCityFromAddress(meal.location);
		return city;
	}

	@Resolve()
	public async relativeDistance(meal: Meal): Promise<number> {
		if (invalidUser(this.currentUser)) { return -1; }
		const distanceInMiles: number = userToMealMiles(this.currentUser, meal);

		return distanceInMiles;
	}

	@Resolve()
	public async guestCount(meal: Meal): Promise<number> {
		const mealFull: Meal | undefined = await this.mealRepository.findOne(meal.id, {
			relations: ["guests"],
		});

		return mealFull.guests.length;
	}

	@Resolve()
	public async isFull(meal: Meal): Promise<boolean> {
		const mealFull: Meal | undefined = await this.mealRepository.findOne(meal.id, {
			relations: ["guests"],
		});
		if (mealFull === undefined) { return false; }

		return mealFull.guests.length >= mealFull.maxGuests;
	}
}
