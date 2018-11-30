import { DeepPartial, MoreThan, Not } from "typeorm";
import { Controller, Mutation, Query } from "vesper";
import { IInput } from "../args";
import { DropLatLong } from "../args/CommonArgs";
import { IFeedArgs, IMealArgs, IMealDeleteArgs, IMealEditArgs, IMealFeedOptions, IMealSaveArgs, IMealToggleGuestArgs, IMealToggleRecipesArgs } from "../args/MealControllerArgs";
import { Meal, Recipe, Tag, Topic, User } from "../entities";
import { MealRepository, RecipeRepository, TagRepository, TopicRepository, UserRepository } from "../repositories";
import { toggleItemByID } from "../repositories/utilities/toggleByID";
import { getLocationByCoords, LocationEntry } from "../utilities/locationInfo";
import filterByChildren from "./utilities/filterByChildren";
import generatePagination, { IPageFeed } from "./utilities/paginatedFeed";

@Controller()
export default class MealController {
	private mealRepository: MealRepository;
	private recipeRepository: RecipeRepository;
	private userRepository: UserRepository;
	private tagRepository: TagRepository;
	private topicRepository: TopicRepository;
	private currentUser: User;

	constructor(
		mealRepository: MealRepository,
		recipeRepository: RecipeRepository,
		userRepository: UserRepository,
		tagRepository: TagRepository,
		topicRepository: TopicRepository,
		user: User
	) {
		this.mealRepository = mealRepository;
		this.recipeRepository = recipeRepository;
		this.userRepository = userRepository;
		this.tagRepository = tagRepository;
		this.topicRepository = topicRepository;
		this.currentUser = user;
	}

	@Query()
	public meal(args: IMealArgs): Promise<Meal | undefined> {
		return this.mealRepository.findOne(args.id);
	}

	public getTag(tag: DeepPartial<Tag>): Promise<Tag | undefined> {
		return this.tagRepository.findOne({ where: { ...tag } });
	}

	public getTopic(topic: DeepPartial<Topic>): Promise<Topic | undefined> {
		return this.topicRepository.findOne({ where: { ...topic } });
	}

	public filterFilledMeals(meals: Meal[]): Meal[] {
		const filteredMeals: Meal[] = [];

		for (const meal of meals) {
			const open: boolean = this.mealHasSeatsOpen(meal);
			if (open) {
				filteredMeals.push(meal);
			}
		}

		return filteredMeals;
	}

	public mealHasSeatsOpen(meal: Meal): boolean {
		return meal.guests.length < meal.maxGuests;
	}

	public getMealRecipeTags(meal: Meal): Tag[] {
		return meal.recipes.flatMap(recipe => recipe.tags);
	}

	public getMealHostTopics(meal: Meal): Topic[] {
		return meal.host.whitelist;
	}

	public async getMealFeed(first: number, filterOptions?: IMealFeedOptions, after?: string): Promise<IPageFeed<Meal> | undefined> {
		if (first < 1) {
			return undefined;
		}

		// Max Guest filtering
		let where: {} = {};
		if (filterOptions !== undefined && filterOptions.maxGuests !== undefined) {
			where = {
				maxGuests: Not(MoreThan(filterOptions.maxGuests)),
			};
		}

		// Getting all meals
		let meals: Meal[] = await this.mealRepository.find({
			where: {
				...where,
				startTime: MoreThan(new Date(new Date().getTime() + 60 * 60000)),  // Now +60 minutes  TODO: Date filtering
			},
			relations: ["host", "guests", "recipes"],
		});
		if (meals.length === 0) {
			return Promise.resolve(undefined);
		}

		// Filtering
		meals = this.filterFilledMeals(meals);
		if (filterOptions !== undefined && filterOptions.tags !== undefined) {
			meals = await filterByChildren(meals, filterOptions.tags, this.getTag, this.getMealRecipeTags);
		}
		if (filterOptions !== undefined && filterOptions.topics !== undefined) {
			meals = await filterByChildren(meals, filterOptions.topics, this.getTopic, this.getMealHostTopics);
		}

		return generatePagination(meals, JSON.stringify([{}, filterOptions]), first, after);
	}

	@Query()
	public feed(args: IFeedArgs): Promise<IPageFeed<Meal> | undefined> { // feed options should be optional
		return this.getMealFeed(
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
		const meal: Meal | undefined = await this.mealRepository.findOne(args.mealID, { relations: ["host"] });
		if (meal === undefined || this.currentUser.id !== meal.host.id) { return false; }

		await this.mealRepository.remove(meal);
		return true;
	}

	@Mutation()
	public async mealToggleGuest(args: IMealToggleGuestArgs): Promise<User[] | undefined> {
		if (this.currentUser === undefined) { return undefined; }

		const meal: Meal | undefined = await this.mealRepository.findOne(args.mealID, { relations: ["host", "guests"] });
		const guest: User | undefined = await this.userRepository.findOne(args.guestID !== undefined ? args.guestID : this.currentUser.id);
		if (meal === undefined || guest === undefined) { return undefined; }
		if (!(guest.id !== this.currentUser.id || meal.host.id !== this.currentUser.id)) { return undefined; }

		await toggleItemByID(meal.guests, guest);

		await this.mealRepository.save(meal);
		return meal.guests;
	}

	@Mutation()
	public async mealToggleRecipes(args: IMealToggleRecipesArgs): Promise<Recipe[] | undefined> {
		if (this.currentUser === undefined) { return undefined; }
		const meal: Meal | undefined = await this.mealRepository.findOne(args.mealID, { relations: ["host", "recipes"] });
		const recipe: Recipe | undefined = await this.recipeRepository.findOne(args.recipeID);

		if (meal === undefined || recipe === undefined) { return undefined; }
		if (meal.host.id !== this.currentUser.id) { return undefined; }

		await toggleItemByID(meal.recipes, recipe);

		await this.mealRepository.save(meal);
		return meal.recipes;
	}
}
