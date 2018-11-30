import { Resolve, Resolver, ResolverInterface } from "vesper";
import { invalidUser } from "../controllers/utilities/validateUser";
import { Meal, User } from "../entities";
import { MealRepository } from "../repositories";
import { userToMealMiles } from "../utilities/distanceCalc";

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
		const broken: string[] = meal.location.split(", ");
		let city: string = broken.slice(broken.length - 3, broken.length - 1).join(", ");
		city = city.replace(/\s\d+/g, "");

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
