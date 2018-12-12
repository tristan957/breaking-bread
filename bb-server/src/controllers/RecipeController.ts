import { DeepPartial } from "typeorm";
import { Controller, Mutation, Query } from "vesper";
import { IInput } from "../args";
import { IRecipeArgs, IRecipeEditArgs, IRecipeReviewArgs, IRecipeReviewEditArgs, IRecipeReviewSaveArgs, IRecipeSaveArgs, IRecipeToggleAllergiesArgs, IRecipeToggleTagsArgs } from "../args/RecipeControllerArgs";
import { Allergy, Recipe, RecipeReview, Tag, User } from "../entities";
import { AllergyRepository, RecipeRepository, RecipeReviewRepository, TagRepository } from "../repositories";
import { invalidUser } from "../utilities/validateUser";

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
		return this.recipeRepository.getEntityManager().findOne(Recipe, args.id);
	}

	@Query()
	public recipeReview(args: IRecipeReviewArgs): Promise<RecipeReview | undefined> {
		return this.recipeReviewRepository.getEntityManager().findOne(RecipeReview, args.id);
	}

	@Mutation()
	public async recipeSave(args: IInput<IRecipeSaveArgs>): Promise<Recipe | undefined> {
		if (invalidUser(this.currentUser)) { return undefined; }
		const recipe: Recipe | undefined = await this.recipeRepository.getEntityManager().findOne(Recipe, { ...args.input });
		return recipe === undefined
			? await this.recipeRepository.getEntityManager().save(Recipe, this.recipeRepository.getEntityManager().create(Recipe, { ...args.input, author: this.currentUser }))
			: recipe;
	}

	@Mutation()
	public async recipeEdit(args: IInput<IRecipeEditArgs>): Promise<Recipe | undefined> {
		if (invalidUser(this.currentUser)) { return undefined; }
		const recipe: Recipe | undefined = await this.recipeRepository.getEntityManager().findOne(Recipe, args.input.id, {
			relations: ["author"],
		});
		if (recipe === undefined) { return undefined; }
		if (this.currentUser.id !== recipe.author.id) { return undefined; }

		return this.recipeRepository.getEntityManager().save(Recipe, { ...recipe, ...args.input });
	}

	public async toggleTags(recipeID: number, tags: DeepPartial<Tag>[], currentUser: User): Promise<Tag[] | undefined> {
		const recipe: Recipe | undefined = await this.recipeRepository.getEntityManager().findOne(Recipe, recipeID, { relations: ["tags", "author"] });
		if (recipe === undefined || recipe.author.id !== currentUser.id) { return undefined; }

		this.tagRepository.toggleTagsList(recipe.tags, tags);
		await this.recipeRepository.getEntityManager().save(Recipe, recipe);
		return recipe.tags;
	}

	@Mutation()
	public async recipeToggleTags(args: IRecipeToggleTagsArgs): Promise<Tag[] | undefined> {
		if (invalidUser(this.currentUser)) { return undefined; }

		return this.toggleTags(args.id, args.tags, this.currentUser);
	}

	public async toggleAllergies(recipeID: number, allergies: DeepPartial<Allergy>[], currentUser: User): Promise<Allergy[] | undefined> {
		const recipe: Recipe | undefined = await this.recipeRepository.getEntityManager().findOne(Recipe, recipeID, { relations: ["allergies", "author"] });
		if (recipe === undefined || recipe.author.id !== currentUser.id) { return undefined; }

		this.allergyRepository.toggleAllergies(recipe.allergies, allergies);
		await this.recipeRepository.getEntityManager().save(Recipe, recipe);
		return recipe.allergies;
	}

	@Mutation()
	public recipeToggleAllergies(args: IRecipeToggleAllergiesArgs): Promise<Allergy[] | undefined> {
		if (invalidUser(this.currentUser)) { return undefined; }

		return this.toggleAllergies(args.id, args.allergies, this.currentUser);
	}

	@Mutation()
	public async recipeReviewSave(args: IInput<IRecipeReviewSaveArgs>): Promise<RecipeReview | undefined> {
		if (invalidUser(this.currentUser)) { return undefined; }	// Need to check if user has been to a meal with this recipe in the past?
		const subject: Recipe | undefined = await this.recipeRepository.getEntityManager().findOne(Recipe, args.input.subjectID);
		if (subject === undefined) { return undefined; }

		const review: RecipeReview | undefined = await this.recipeReviewRepository.getEntityManager().findOne(RecipeReview, {
			where: {
				subject: {
					id: args.input.subjectID,
				},
				author: {
					id: this.currentUser.id,
				},
			},
		});

		return review === undefined ? this.recipeReviewRepository.getEntityManager().save(RecipeReview, this.recipeReviewRepository.getEntityManager().create(RecipeReview, {
			...args.input,
			author: this.currentUser,
			subject,
		})) : review;
	}

	@Mutation()
	public async recipeReviewEdit(args: IInput<IRecipeReviewEditArgs>): Promise<RecipeReview | undefined> {
		if (invalidUser(this.currentUser)) { return undefined; }
		const review: RecipeReview | undefined = await this.recipeReviewRepository.getEntityManager().findOne(RecipeReview, args.input.id, {
			relations: ["author"],
		});
		if (this.currentUser.id !== review.author.id) { return undefined; }

		return review === undefined ? undefined : this.recipeReviewRepository.getEntityManager().save(RecipeReview, {
			...review,
			...args.input,
		});
	}
}
