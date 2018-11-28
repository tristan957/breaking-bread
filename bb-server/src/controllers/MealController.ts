import { DeepPartial } from "typeorm";
import { Controller, Mutation, Query } from "vesper";
import { Meal, Recipe, Tag, Topic, User } from "../entities";
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
		return this.mealRepository.getMealFeed(args.first, args.feedOptions, args.after);
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

		toggleItemByID(meal.guests, guest);

		this.mealRepository.save(meal);
		return meal.guests;
	}

	@Mutation()
	public async mealEdit(args: IMealEditArgs): Promise<Meal | undefined> {
		const meal: Meal | undefined = await this.mealRepository.findOne(args.id);
		return meal === undefined ? undefined : this.mealRepository.save({ ...meal, ...args });
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

interface IMealArgs {
	id: number;
}

interface IFeedArgs {
	feedOptions?: IMealFeedOptions;
	first: number;
	after?: string;
}

interface IMealEdge {
	node: DeepPartial<Meal>;
	cursor: string;
}

interface IPageInfo {
	endCursor: string;
	hasNextPage: boolean;
}

export interface IMealFeedOptions {
	location: ILocationFilter;
	dateSpan: IDateSpanFilter;
	maxGuests?: number;
	tags?: DeepPartial<Tag>[];
	topics?: DeepPartial<Topic>[];
}

interface ILocationFilter {
	distanceMI: number;
	fromLocation: string;
}

interface IDateSpanFilter {
	from: Date;
	to: Date;
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

interface IMealToggleRecipesArgs {
	mealID: number;
	recipeID: number;
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
