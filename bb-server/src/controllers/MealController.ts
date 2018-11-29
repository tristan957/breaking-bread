import { Controller, Mutation, Query } from "vesper";
import { IInput } from "../args";
import { IFeedArgs, IMealArgs, IMealDeleteArgs, IMealEditArgs, IMealSaveArgs, IMealToggleGuestArgs, IMealToggleRecipesArgs } from "../args/MealControllerArgs";
import { Meal, Recipe, User } from "../entities";
import { MealRepository, RecipeRepository, UserRepository } from "../repositories";
import { toggleItemByID } from "../repositories/utilities/toggleByID";
import { IPageFeed } from "./utilities/paginatedFeed";

@Controller()
export default class MealController {
	private mealRepository: MealRepository;
	private recipeRepository: RecipeRepository;
	private userRepository: UserRepository;
	private currentUser: User;

	constructor(mealRepository: MealRepository, recipeRepository: RecipeRepository, userRepository: UserRepository, user: User) {
		this.mealRepository = mealRepository;
		this.recipeRepository = recipeRepository;
		this.userRepository = userRepository;
		this.currentUser = user;
	}

	@Query()
	public meal(args: IMealArgs): Promise<Meal | undefined> {
		return this.mealRepository.findOne(args.id);
	}

	@Query()
	public feed(args: IFeedArgs): Promise<IPageFeed<Meal> | undefined> { // feed options should be optional
		return this.mealRepository.getMealFeed(
			args.first,
			args.filterOptions === undefined ? undefined : args.filterOptions.feedOptions,
			args.after
		);
	}

	@Mutation()
	public mealSave(args: IInput<IMealSaveArgs>): Promise<Meal> {
		const meal = this.mealRepository.create(args.input);
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

		toggleItemByID(meal.guests, guest);

		this.mealRepository.save(meal);
		return meal.guests;
	}

	@Mutation()
	public async mealEdit(args: IInput<IMealEditArgs>): Promise<Meal | undefined> {
		const meal: Meal | undefined = await this.mealRepository.findOne(args.input.id);
		return meal === undefined ? undefined : this.mealRepository.save({ ...meal, ...args.input });
	}

	@Mutation()
	public async mealToggleRecipes(args: IMealToggleRecipesArgs): Promise<Recipe[] | undefined> {
		const meal: Meal | undefined = await this.mealRepository.findOne(args.mealID, {
			relations: ["host"],
		});
		const recipe: Recipe | undefined = await this.recipeRepository.findOne(args.recipeID);
		if (meal === undefined || recipe === undefined) {
			return undefined;
		}
		if (meal.host.id !== this.currentUser.id) {
			return undefined;
		}

		toggleItemByID(meal.recipes, recipe);

		this.mealRepository.save(meal);
		return meal.recipes;
	}
}
