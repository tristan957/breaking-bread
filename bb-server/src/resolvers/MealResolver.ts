import { Resolve, Resolver, ResolverInterface } from "vesper";
import { Meal } from "../entities";
import { MealRepository } from "../repositories";

@Resolver(Meal)
export default class MealResolver implements ResolverInterface<Meal> {
	private mealRepository: MealRepository;

	constructor(mealRepository: MealRepository) {
		this.mealRepository = mealRepository;
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
