import { Resolve, Resolver, ResolverInterface } from "vesper";
import { Meal, User } from "../entities";
import { MealRepository } from "../repositories";

@Resolver(Meal)
export default class MealResolver implements ResolverInterface<Meal> {
	private mealRepository: MealRepository;
	private currentUser: User;

	constructor(mealRepository: MealRepository, user: User) {
		this.mealRepository = mealRepository;
		this.currentUser = user;  // TODO: on distance check for logged in users, make general location a resolver and only show city
	}

	@Resolve()
	public async city(meal: Meal): Promise<string> {
		const broken: string[] = meal.location.split(", ");
		let city: string = broken.slice(broken.length - 3, broken.length - 1).join(", ");
		city = city.replace(/\s\d+/g, "");

		return city;
	}

	@Resolve()
	public async guestCount(meal: Meal): Promise<number | undefined> {
		const mealFull: Meal | undefined = await this.mealRepository.findOne(meal.id, {
			relations: ["guests"],
		});
		if (mealFull === undefined) { return undefined; }

		return mealFull.guests.length;
	}

	@Resolve()
	public async isFull(meal: Meal): Promise<boolean | undefined> {
		const mealFull: Meal | undefined = await this.mealRepository.findOne(meal.id, {
			relations: ["guests"],
		});
		if (mealFull === undefined) { return undefined; }

		return mealFull.guests.length >= mealFull.maxGuests;
	}
}
