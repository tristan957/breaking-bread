import { Service } from "typedi";
import { DeepPartial, EntityManager, MoreThan, Not, Repository } from "typeorm";
import { TagRepository, TopicRepository } from ".";
import { IMealFeedOptions } from "../args/MealControllerArgs";
import filterByChildren from "../controllers/utilities/filterByChildren";
import generatePagination, { IPageFeed } from "../controllers/utilities/paginatedFeed";
import { Meal, Tag, Topic } from "../entities";

@Service()
export default class MealRepository extends Repository<Meal> {
	private tagRepository: TagRepository;
	private topicRepository: TopicRepository;
	private entityManager: EntityManager;

	constructor(tagRepository: TagRepository, topicRepository: TopicRepository, entityManager: EntityManager) {
		super();

		this.entityManager = entityManager;
		this.tagRepository = tagRepository;
		this.topicRepository = topicRepository;
	}

	private getTag(tag: DeepPartial<Tag>): Promise<Tag | undefined> {
		return this.tagRepository.findOne({ where: { ...tag } });
	}

	private getTopic(topic: DeepPartial<Topic>): Promise<Topic | undefined> {
		return this.topicRepository.findOne({ where: { ...topic } });
	}

	private filterFilledMeals(meals: Meal[]): Meal[] {
		const filteredMeals: Meal[] = [];

		for (const meal of meals) {
			const open: boolean = this.mealHasSeatsOpen(meal);
			if (open) {
				filteredMeals.push(meal);
			}
		}

		return filteredMeals;
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
		let meals: Meal[] = await this.find({
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

		// what missing here idk it cant map the generic output type to the one we have here
		// does one need to extend the other
		// do we need to return a page feed
		// Yeah I think we have to find a way to cast it or extend it
		// ez. I don't know how this will work in graphql
		// might just see if the interface we provide has the right keys
		// I think it will work, seems like it. Let's see if it complains on the controller
		return generatePagination(meals, JSON.stringify([{}, filterOptions]), first, after);
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
}
