import { Controller, Mutation, Query } from "vesper";
import Recipe from "../entities/Recipe";
import RecipeReview from "../entities/RecipeReview";
import Tag from "../entities/Tag";
import User from "../entities/User";
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

	@Mutation()
	public async recipeSave(args: IRecipeSaveArgs): Promise<Recipe> {
		const recipe: Recipe | undefined = await this.recipeRepository.findOne({ ...args });
		return recipe === undefined ? this.recipeRepository.save(this.recipeRepository.create(args)) : recipe;
	}

	@Mutation()
	public recipeEdit(): Promise<Recipe | undefined> {

	}

	@Mutation()
	public recipeToggleTags(args: IRecipeToggleTagsArgs): Promise<Tag[] | undefined> {
		const recipe: Recipe | undefined

	}

	@Mutation()
	public recipeToggleAllergies(): Promise<Allergy[] | undefined> {

	}

	@Mutation()
	public async recipeReviewSave(args: IRecipeReviewSaveArgs): Promise<RecipeReview> {
		const review: RecipeReview | undefined = await this.recipeReviewRepository.findOne({
			subject: {
				id: args.subjectID,
			},
			author: {
				id: this.currentUser.id,
			},
		});

		return review === undefined ? this.recipeReviewRepository.save(this.recipeReviewRepository.create({
			...args,
			author: {
				id: this.currentUser.id,
			},
			subject: {
				id: args.subjectID,
			},
		})) : review;
		// const recipeReview: RecipeReview | undefined = await this.recipeReviewRepository.createQueryBuilder()
		// 	.innerJoinAndSelect()
		// 	.findOne();
	}

	@Mutation()
	public async recipeReviewEdit(args: IRecipeReviewEditArgs): Promise<RecipeReview | undefined> {
		const review: RecipeReview | undefined = await this.recipeReviewRepository.findOne(args.id);
		return review === undefined ? undefined : this.recipeReviewRepository.save(
			{
				...review,
				...args,
			}
		);
	}
}

interface IRecipeArgs {
	id: number;
}

interface IRecipeSaveArgs {
	name: string;
	description?: string;
	imagePath?: string;
}

interface IRecipeReviewSaveArgs {
	rating: number;
	description?: string;
	subjectID: number;
}

interface IRecipeReviewEditArgs {
	id: number;
	rating?: number;
	description?: string;
}

interface IRecipeToggleTagsArgs {
	id: number;
	tags: DeepPartial<Tag>[];
}
