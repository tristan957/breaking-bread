import { DeepPartial } from "typeorm";
import { Controller, Mutation, Query } from "vesper";
import { Recipe, Tag, Topic, User, UserReview } from "../entities";
import { RecipeRepository, UserRepository, UserReviewRepository } from "../repositories";
import { toggleItemByID } from "../repositories/utilities/toggleByID";

@Controller()
export default class UserController {
	private userRepository: UserRepository;
	private userReviewRepository: UserReviewRepository;
	private recipeRepository: RecipeRepository;
	private currentUser: User;

	constructor(userRepository: UserRepository, userReviewRepository: UserReviewRepository, recipeRepository: RecipeRepository, user: User) {
		this.userRepository = userRepository;
		this.userReviewRepository = userReviewRepository;
		this.recipeRepository = recipeRepository;
		this.currentUser = user;
	}

	@Query()
	public user(args: IUserArgs): Promise<User | undefined> {
		return this.userRepository.findOne(args.id);
	}

	@Query()
	public userAuthenticated(): User {
		return this.currentUser;	// Will return undefined if auth fails
	}

	@Query()
	public userReview(args: IUserReviewArgs): Promise<UserReview | undefined> {
		return this.userReviewRepository.findOne(args.id);
	}

	@Mutation()
	public userSave(args: IUserSaveArgs): Promise<User> {
		const user: User = this.userRepository.create(args);
		return this.userRepository.save(user);
	}

	@Mutation()
	public async userEdit(args: IUserEditArgs): Promise<User | undefined> {
		const user: User | undefined = await this.userRepository.findOne(args.id);
		if (user === undefined) { return undefined; }
		return this.userRepository.save({ ...user, ...args });
	}

	@Mutation()
	public async userDelete(args: IUserArgs): Promise<boolean> {
		const user: User | undefined = await this.userRepository.findOne(args.id);
		if (user === undefined) { return false; }
		this.userRepository.remove(user);
		return true;
	}

	@Mutation()
	public userToggleWhitelist(args: IUserToggleTopiclistArgs): Promise<Topic[] | undefined> {
		return this.userRepository.toggleWhitelist(this.currentUser, args.topics);
	}

	@Mutation()
	public userToggleBlacklist(args: IUserToggleTopiclistArgs): Promise<Topic[] | undefined> {
		return this.userRepository.toggleBlacklist(this.currentUser, args.topics);
	}

	@Mutation()
	public userToggleFollowedTags(args: IUserToggleTagsArgs): Promise<Tag[] | undefined> {
		return this.userRepository.toggleFollowedTags(this.currentUser, args.tags);
	}

	@Mutation()
	public async userToggleFollowing(args: IUserArgs): Promise<User[] | undefined> {
		const followedUsers: User[] = await this.currentUser.followedUsers;
		const toFollow: User | undefined = await this.userRepository.findOne(args.id);
		if (toFollow === undefined) { return undefined; }

		toggleItemByID(followedUsers, toFollow);
		this.userRepository.save({ ...this.currentUser, followedUsers });
		return followedUsers;
	}

	@Mutation()
	public async userToggleSavedRecipe(args: IUserArgs): Promise<Recipe[] | undefined> {
		const savedRecipes: Recipe[] = await this.currentUser.savedRecipes;
		const toSave: Recipe | undefined = await this.recipeRepository.findOne(args.id);
		if (toSave === undefined) { return undefined; }

		toggleItemByID(savedRecipes, toSave);
		this.userRepository.save({ ...this.currentUser, savedRecipes });
		return savedRecipes;
	}

	@Mutation()
	public async userReviewSave(args: IUserReviewSaveArgs): Promise<UserReview> {
		const review: UserReview | undefined = await this.userReviewRepository.findOne({
			subject: {
				id: args.subjectID,
			},
			author: {
				id: this.currentUser.id,
			},
		});

		return review === undefined ? this.userReviewRepository.save(this.userReviewRepository.create({
			...args,
			author: {
				id: this.currentUser.id,
			},
			subject: {
				id: args.subjectID,
			},
		})) : review;
	}

	@Mutation()
	public async userReviewEdit(args: IUserReviewEditArgs): Promise<UserReview | undefined> {
		const review: UserReview | undefined = await this.userReviewRepository.findOne(args.id);
		return review === undefined ? undefined : this.userReviewRepository.save(
			{
				...review,
				...args,
			}
		);
	}
}

interface IUserArgs {
	id: number;
}

interface IUserSaveArgs {
	firstName: string;
	lastName: string;
	imagePath?: string;
	about: string;
	email: string;
	phoneNumber: string;
}

interface IUserEditArgs {
	id: number;
	imagePath?: string;
	about?: string;
	email?: string;
	phoneNumber?: string;
}

// interface ITopicTagToggleArgs {
// 	id: number;
// 	name: string;
// }

interface IUserReviewArgs {
	id: number;
}

interface IUserReviewSaveArgs {
	rating: number;
	description?: string;
	subjectID: number;
	authorID: number;
}

interface IUserReviewEditArgs {
	id: number;
	rating?: number;
	description?: string;
}

interface IUserToggleTagsArgs {
	tags: DeepPartial<Tag>[];
}

interface IUserToggleTopiclistArgs {
	topics: DeepPartial<Topic>[];
}
