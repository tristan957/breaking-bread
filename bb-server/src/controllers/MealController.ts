import { EntityManager } from "typeorm";
import { Controller, Mutation, Query } from "vesper";
import Meal from "../entities/Meal";

@Controller()
export default class MealController {
	private entityManager: EntityManager;

	constructor(entityManager: EntityManager) {
		this.entityManager = entityManager;
	}

	@Query()
	public meal(args: IMealArgs): Promise<Meal | undefined> {
		return this.entityManager.findOne(Meal, args.id);
	}

	@Mutation()
	public mealSave(args: IMealSaveArgs): Promise<Meal> {
		const meal = this.entityManager.create(Meal, args);
		return this.entityManager.save(Meal, meal);
	}

	@Mutation()
	public mealDelete(args: IMealDeleteArgs): Promise<Boolean> {
		// return this.entityManager.remove(Meal, { id: args.id }) !== null;
	}

	@Mutation()
	public mealGuestToggle(args: IMealGuestToggleArgs): Promise<Meal[] | undefined> {

	}

	@Mutation()
	public mealUpdate(args: IMealUpdateArgs): Promise<Meal | undefined> {

	}

	@Mutation()
	public mealRecipesUpdate(args: IMealRecipesUpdateArgs): Promise<Meal | undefined> {

	}
}

interface IMealArgs {
	id: number;
}

interface IMealSaveArgs {
	location: string;
	startTime: Date;
	endTime: Date;
	price: number;
	title: string;
	description?: string;
	imagePath?: string;
	maxGuests: number;
}

interface IMealDeleteArgs {
	id: number;
}
