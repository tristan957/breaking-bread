import { Controller, Mutation, Query } from "vesper";
import { IInput } from "../args";
import { IRecipeArgs, IRecipeEditArgs, IRecipeReviewArgs, IRecipeReviewEditArgs, IRecipeReviewSaveArgs, IRecipeSaveArgs, IRecipeToggleAllergiesArgs, IRecipeToggleTagsArgs } from "../args/RecipeControllerArgs";
import { Allergy, Recipe, RecipeReview, Tag, User } from "../entities";
import { RecipeRepository, RecipeReviewRepository } from "../repositories";

@Controller()
export default class RecipeController {
	private recipeRepository: RecipeRepository;
	private recipeReviewRepository: RecipeReviewRepository;
	private currentUser: User;

	constructor(recipeRepository: RecipeRepository, recipeReviewRepository: RecipeReviewRepository, user: User) {
		this.recipeRepository = recipeRepository;
		this.recipeReviewRepository = recipeReviewRepository;
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
	public async recipeSave(args: IInput<IRecipeSaveArgs>): Promise<Recipe> {
		const recipe: Recipe | undefined = await this.recipeRepository.findOne({ ...args.input });
		return recipe === undefined ? this.recipeRepository.save(this.recipeRepository.create(args.input)) : recipe;
	}

	@Mutation()
	public async recipeEdit(args: IInput<IRecipeEditArgs>): Promise<Recipe | undefined> {
		const recipe: Recipe | undefined = await this.recipeRepository.findOne(args.input.id);
		if (recipe === undefined) { return undefined; }
		return this.recipeRepository.save({ ...recipe, ...args.input });
	}

	@Mutation()
	public async recipeToggleTags(args: IRecipeToggleTagsArgs): Promise<Tag[] | undefined> {
		return this.recipeRepository.toggleTags(args.id, args.tags);
	}

	@Mutation()
	public recipeToggleAllergies(args: IRecipeToggleAllergiesArgs): Promise<Allergy[] | undefined> {
		return this.recipeRepository.toggleAllergies(args.id, args.allergies);
	}

	@Mutation()
	public async recipeReviewSave(args: IInput<IRecipeReviewSaveArgs>): Promise<RecipeReview> {
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
		const review: RecipeReview | undefined = await this.recipeReviewRepository.findOne(args.input.id);
		return review === undefined ? undefined : this.recipeReviewRepository.save(
			{
				...review,
				...args.input,
			}
		);
	}
}
