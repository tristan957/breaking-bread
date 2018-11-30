import { Controller, Mutation, Query } from "vesper";
import { IInput } from "../args";
import { DropLatLong } from "../args/CommonArgs";
import { IFeedArgs, IMealArgs, IMealDeleteArgs, IMealEditArgs, IMealSaveArgs, IMealToggleGuestArgs, IMealToggleRecipesArgs } from "../args/MealControllerArgs";
import { Meal, Recipe, User } from "../entities";
import { MealRepository, RecipeRepository, UserRepository } from "../repositories";
import { toggleItemByID } from "../repositories/utilities/toggleByID";
import { getLocationByCoords, LocationEntry } from "../utilities/locationInformation";
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
	public async mealSave(args: IInput<IMealSaveArgs>): Promise<Meal | undefined> {
		const { latLong, ...inputNoLatLong }: DropLatLong<IMealSaveArgs> = args.input;
		const locationInfo: LocationEntry = await getLocationByCoords(latLong.lat, latLong.long);
		if (locationInfo.formattedAddress === undefined) { return undefined; }

		const meal = this.mealRepository.create({
			...inputNoLatLong,
			latLong: `${latLong.lat}|${latLong.long}`,
			location: locationInfo.formattedAddress,
		});
		return this.mealRepository.save(meal);
	}

	@Mutation()
	public async mealEdit(args: IInput<IMealEditArgs>): Promise<Meal | undefined> {
		const { latLong, ...inputNoLatLong }: DropLatLong<IMealEditArgs> = args.input;

		if (this.currentUser === undefined) { return undefined; }
		const meal: Meal | undefined = await this.mealRepository.findOne(args.input.id, { relations: ["host"] });
		if (meal === undefined || meal.host.id !== this.currentUser.id) { return undefined; }

		if (latLong !== undefined) {
			const locationInfo: LocationEntry = await getLocationByCoords(latLong.lat, latLong.long);
			if (locationInfo.formattedAddress === undefined) { return undefined; }

			return this.mealRepository.save({
				...meal,
				...inputNoLatLong,
				latLong: `${latLong.lat}|${latLong.long}`,
				location: locationInfo.formattedAddress,
			});
		}

		return this.mealRepository.save({
			...meal,
			...inputNoLatLong,
		});
	}

	@Mutation()
	public async mealDelete(args: IMealDeleteArgs): Promise<Boolean | undefined> {
		if (this.currentUser === undefined) { return undefined; }
		const meal: Meal | undefined = await this.mealRepository.findOne(args.id, { relations: ["host"] });
		if (meal === undefined || this.currentUser.id !== meal.host.id) { return false; }

		this.mealRepository.remove(meal);
		return true;
	}

	@Mutation()
	public async mealToggleGuest(args: IMealToggleGuestArgs): Promise<User[] | undefined> {
		if (this.currentUser === undefined) { return undefined; }

		const meal: Meal | undefined = await this.mealRepository.findOne(args.mealID, { relations: ["host", "guests"] });
		const guest: User | undefined = await this.userRepository.findOne(args.guestID !== undefined ? args.guestID : this.currentUser.id);
		if (meal === undefined || guest === undefined) { return undefined; }
		if (!(guest.id !== this.currentUser.id || meal.host.id !== this.currentUser.id)) { return undefined; }

		toggleItemByID(meal.guests, guest);

		this.mealRepository.save(meal);
		return meal.guests;
	}

	@Mutation()
	public async mealToggleRecipes(args: IMealToggleRecipesArgs): Promise<Recipe[] | undefined> {
		if (this.currentUser === undefined) { return undefined; }
		const meal: Meal | undefined = await this.mealRepository.findOne(args.mealID, { relations: ["host", "recipes"] });
		const recipe: Recipe | undefined = await this.recipeRepository.findOne(args.recipeID);

		if (meal === undefined || recipe === undefined) { return undefined; }
		if (meal.host.id !== this.currentUser.id) { return undefined; }

		toggleItemByID(meal.recipes, recipe);

		this.mealRepository.save(meal);
		return meal.recipes;
	}
}
