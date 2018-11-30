import { DeepPartial } from "typeorm";
import { Controller, Mutation, Query } from "vesper";
import { IInput } from "../args";
import { IRecipeArgs, IRecipeEditArgs, IRecipeReviewArgs, IRecipeReviewEditArgs, IRecipeReviewSaveArgs, IRecipeSaveArgs, IRecipeToggleAllergiesArgs, IRecipeToggleTagsArgs } from "../args/RecipeControllerArgs";
import { Allergy, Recipe, RecipeReview, Tag, User } from "../entities";
import { AllergyRepository, RecipeRepository, RecipeReviewRepository, TagRepository } from "../repositories";

@Controller()
export default class RecipeController {
	private recipeRepository: RecipeRepository;
	private recipeReviewRepository: RecipeReviewRepository;
	private tagRepository: TagRepository;
	private allergyRepository: AllergyRepository;
	private currentUser: User;

	constructor(
		recipeRepository: RecipeRepository,
		recipeReviewRepository: RecipeReviewRepository,
		tagRepository: TagRepository,
		allergyRepository: AllergyRepository,
		user: User
	) {
		this.recipeRepository = recipeRepository;
		this.recipeReviewRepository = recipeReviewRepository;
		this.tagRepository = tagRepository;
		this.allergyRepository = allergyRepository;
		this.currentUser = user;
	}

	@Query()
	public recipe(args: IRecipeArgs): Promise<Recipe | undefined> {
		return this.recipeRepository.findOne(args.id);
	}

	@Query()
	public recipeReview(args: IRecipeReviewArgs): Promise<RecipeReview | undefined> {
		return this.recipeReviewRepository.findOne(args.id);
	}

	@Mutation()
	public async recipeSave(args: IInput<IRecipeSaveArgs>): Promise<Recipe | undefined> {
		if (this.currentUser === undefined) { return undefined; }
		const recipe: Recipe | undefined = await this.recipeRepository.findOne({ ...args.input });
		return recipe === undefined ? this.recipeRepository.save(this.recipeRepository.create(args.input)) : recipe;
	}

	@Mutation()
	public async recipeEdit(args: IInput<IRecipeEditArgs>): Promise<Recipe | undefined> {
		if (this.currentUser === undefined) { return undefined; }
		const recipe: Recipe | undefined = await this.recipeRepository.findOne(args.input.id, {
			relations: ["author"],
		});
		if (recipe === undefined) { return undefined; }
		if (this.currentUser.id !== recipe.author.id) { return undefined; }

		return this.recipeRepository.save({ ...recipe, ...args.input });
	}

	public async toggleTags(recipeID: number, tags: DeepPartial<Tag>[], currentUser: User): Promise<Tag[] | undefined> {
		const recipe: Recipe | undefined = await this.recipeRepository.findOne(recipeID, { relations: ["tags", "author"] });
		// TODO: please check the above to make sure it works
		if (recipe === undefined || recipe.author.id !== currentUser.id) { return undefined; }

		this.tagRepository.toggleTagsList(recipe.tags, tags);
		await this.recipeRepository.save(recipe);
		return recipe.tags;
	}

	@Mutation()
	public async recipeToggleTags(args: IRecipeToggleTagsArgs): Promise<Tag[] | undefined> {
		if (this.currentUser === undefined) { return undefined; }

		return this.toggleTags(args.id, args.tags, this.currentUser);
	}

	public async toggleAllergies(recipeID: number, allergies: DeepPartial<Allergy>[], currentUser: User): Promise<Allergy[] | undefined> {
		const recipe: Recipe | undefined = await this.recipeRepository.findOne(recipeID, { relations: ["allergies", "author"] });
		// TODO: please check the above to make sure it works
		if (recipe === undefined || recipe.author.id !== currentUser.id) { return undefined; }

		this.allergyRepository.toggleAllergies(recipe.allergies, allergies);
		await this.recipeRepository.save(recipe);
		return recipe.allergies;
	}

	@Mutation()
	public recipeToggleAllergies(args: IRecipeToggleAllergiesArgs): Promise<Allergy[] | undefined> {
		if (this.currentUser === undefined) { return undefined; }

		return this.toggleAllergies(args.id, args.allergies, this.currentUser);
	}

	@Mutation()
	public async recipeReviewSave(args: IInput<IRecipeReviewSaveArgs>): Promise<RecipeReview | undefined> {
		if (this.currentUser === undefined) { return undefined; }	// Need to check if user has been to a meal with this recipe in the past?
		const subject: Recipe | undefined = await this.recipeRepository.findOne(args.input.subjectID);
		if (subject === undefined) { return undefined; }

		const review: RecipeReview | undefined = await this.recipeReviewRepository.findOne({
			where: {
				subject: {
					id: args.input.subjectID,
				},
				author: {
					id: this.currentUser.id,
				},
			},
		});

		return review === undefined ? this.recipeReviewRepository.save(this.recipeReviewRepository.create({
			...args.input,
			author: this.currentUser,
			subject,
		})) : review;
	}

	@Mutation()
	public async recipeReviewEdit(args: IInput<IRecipeReviewEditArgs>): Promise<RecipeReview | undefined> {
		if (this.currentUser === undefined) { return undefined; }
		const review: RecipeReview | undefined = await this.recipeReviewRepository.findOne(args.input.id, {
			relations: ["author"],
		});
		if (this.currentUser.id !== review.author.id) { return undefined; }

		return review === undefined ? undefined : this.recipeReviewRepository.save(
			{
				...review,
				...args.input,
			}
		);
	}
}
