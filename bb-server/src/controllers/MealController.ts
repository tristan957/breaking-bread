import { Controller, Mutation, Query } from "vesper";
import Meal from "../entities/Meal";
import User from "../entities/User";
import { MealRepository, RecipeRepository, UserRepository } from "../repositories";

@Controller()
export default class MealController {
	private mealRepository: MealRepository;
	private recipeRepository: RecipeRepository;
	private userRepository: UserRepository;
	private currentUser: User;

	constructor(mealRepository: MealRepository, recipeRepo: RecipeRepository, userRepo: UserRepository, user: User) {
		this.mealRepository = mealRepository;
		this.recipeRepository = recipeRepo;
		this.userRepository = userRepo;
		this.currentUser = user;
	}

	@Query()
	public meal(args: IMealArgs): Promise<Meal | undefined> {
		return this.mealRepository.findOne(args.id);
	}

	@Mutation()
	public mealSave(args: IMealSaveArgs): Promise<Meal> {
		const meal = this.mealRepository.create(args);
		return this.mealRepository.save(meal);
	}

	@Mutation()
	public async mealDelete(args: IMealDeleteArgs): Promise<Boolean> {
		const meal: Meal | undefined = await this.mealRepository.findOne(args.id);
		if (meal === undefined) { return false; }
		this.mealRepository.remove(meal);
		return true;
	}

	@Mutation()
	public async mealToggleGuest(args: IMealToggleGuestArgs): Promise<User[] | undefined> {
		const meal: Meal | undefined = await this.mealRepository.findOne(args.mealID, {
			relations: ["host"],
		});
		const guest: User | undefined = await this.userRepository.findOne(args.guestID);
		if (meal === undefined || guest === undefined) {
			return undefined;
		}
		if (meal.host.id !== this.currentUser.id) {
			return undefined;
		}

		const guests: User[] = await meal.guests;
		const guestIDs: number[] = guests.map(a => a.id);
		if (guestIDs.includes(args.guestID)) {
			const index: number = guestIDs.indexOf(args.guestID);
			meal.guests.splice(index, 1);
		} else {
			meal.guests.push(guest);
		}

		this.mealRepository.save(meal);
		return meal.guests;
	}

	@Mutation()
	public async mealEdit(args: IMealEditArgs): Promise<Meal | undefined> {
		const meal: Meal | undefined = await this.mealRepository.findOne(args.id);
		return meal === undefined ? undefined : this.mealRepository.save({ ...meal, ...args });
	}

	@Mutation()
	public mealToggleRecipes(args: IMealRecipesUpdateArgs): Promise<Meal | undefined> {
		// TODO: Just by id. Front end you should either see a list of your saved recipes or the option to search/create a new one which would get an id
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

interface IMealToggleGuestArgs {
	mealID: number;
	guestID: number;
}

interface IMealEditArgs {
	id: number;
	location?: string;
	startTime?: Date;  // TODO: Email on time, price changes
	endTime?: Date;
	price?: number;
	title?: string;
	description?: string;
	imagePath?: string;
}
